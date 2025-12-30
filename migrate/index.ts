import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.NUXT_TURSO_DB_URL as string,
  authToken: process.env.NUXT_TURSO_DB_AUTH_TOKEN as string,
});

const frameworks = [
  // ['Vue.js', 'JavaScript', 'https://github.com/vuejs/vue', 203000],
  // ['React', 'JavaScript', 'https://github.com/facebook/react', 206000],
  ['Angular', 'TypeScript', 'https://github.com/angular/angular', 87400],
  ['ASP.NET Core', 'C#', 'https://github.com/dotnet/aspnetcore', 31400],
  ['Express', 'JavaScript', 'https://github.com/expressjs/express', 60500],
  ['Django', 'Python', 'https://github.com/django/django', 69800],
  ['Ruby on Rails', 'Ruby', 'https://github.com/rails/rails', 52600],
  [
    'Spring',
    'Java',
    'https://github.com/spring-projects/spring-framework',
    51400,
  ],
  ['Laravel', 'PHP', 'https://github.com/laravel/laravel', 73100],
  ['Flask', 'Python', 'https://github.com/pallets/flask', 62500],
  ['Ruby', 'Ruby', 'https://github.com/ruby/ruby', 41000],
  ['Symfony', 'PHP', 'https://github.com/symfony/symfony', 28200],
  ['CodeIgniter', 'PHP', 'https://github.com/bcit-ci/CodeIgniter', 18200],
  ['CakePHP', 'PHP', 'https://github.com/cakephp/cakephp', 8600],
  ['Qwik', 'TypeScript', 'https://github.com/BuilderIO/qwik', 16400],
];

async function main() {
  // await client.execute(
  //   'CREATE TABLE IF NOT EXISTS frameworks (id INTEGER PRIMARY KEY, name VARCHAR (50) NOT NULL, language VARCHAR (50) NOT NULL, url TEXT NOT NULL, stars INTEGER NOT NULL)'
  // );
  // console.log('Migrated db!');

  const statements = [
    'DROP TABLE IF EXISTS frameworks',
    'CREATE TABLE IF NOT EXISTS frameworks (id INTEGER PRIMARY KEY, name VARCHAR (50) NOT NULL, language VARCHAR (50) NOT NULL, url TEXT NOT NULL, stars INTEGER NOT NULL)',
    'CREATE UNIQUE INDEX idx_frameworks_name ON frameworks (name)',
    'CREATE UNIQUE INDEX idx_frameworks_url ON frameworks (url)',
    'DELETE FROM frameworks',
    ...frameworks.map((framework) => ({
      sql: 'INSERT INTO frameworks (name, language, url, stars) VALUES (?, ?, ?, ?)',
      args: framework,
    })),
  ];

  await client.batch(statements, 'write');

  console.log('Seeded db');
}

main().catch(console.log);
