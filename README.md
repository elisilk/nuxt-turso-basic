# [Top Web Frameworks]

A website listing top web frameworks made with [Nuxt], [Turso], and [Nuxt UI].

Adapted from the [Top Web Frameworks](https://github.com/tursodatabase/examples/tree/master/app-top-web-frameworks) example app found in the [Nuxt + Turso guide](https://docs.turso.tech/sdk/ts/guides/nuxt).

## Technologies Used

- [Nuxt] - Framework
- [Turso] - Database
- [Nuxt UI] - UI
- [Netlify] - Deployment

---

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation] for more information.

---

## Project Structure

This project is using [Nuxt], the intuitive Vue framework.

Inside your project, you'll see the following directory structure:

```
└── pages/
│   ├── index.vue
│   ├── about.vue
│   ├── add.vue
│   └── old/
│       ├── index.vue
│       └── add.vue
├── server
│   ├── api
│   │   └── frameworks
│   │       ├── index.get.ts
│   │       ├── index.post.ts
│   │       ├── [id].get.ts
│   │       ├── [id].put.ts
│   │       └── [id].delete.ts
│   └── utils
│       └── turso.ts
└── app.vue
```

- `src/pages`: Houses the file-based routing files
- `app.vue` is the main layout of the app
- The files under `/server/api` are endpoints.

The helper functions under `/server/utils` are auto-imported into the endpoint files.

## Setting up the database

[Install the Turso CLI].

Create a new turso database.

```sh
turso db create web-frameworks
```

### Set up Turso on the project

To access the data stored inside your database, you need the Turso database url
and an authentication token.

To obtain the database url, run the following command:

```sh
turso db show web-frameworks --url
```

And, to create an authentication token for your database, run:

```sh
turso db tokens create web-frameworks
```

Add a `.env` file at the root of the project and inside it add the values obtained above as the database url and authentication token for your Turso database.

```txt
NUXT_TURSO_DB_URL=
NUXT_TURSO_DB_AUTH_TOKEN=
```

### Create tables and indexes

> **Note**
>
> You can run `npm run migrate:dev` and skip this step. Otherwise, proceed to
> experience working within the Turso CLI shell.

First, access the database through the Turso CLI shell.

```sh
turso db shell web-frameworks
```

Next, run the following SQL statement to create the `frameworks` table.

```sql
-- create the "frameworks" table
CREATE TABLE frameworks (
    id INTEGER PRIMARY KEY,
    name VARCHAR (50) NOT NULL,
    language VARCHAR (50) NOT NULL,
    url TEXT NOT NULL,
    stars INTEGER NOT NULL
);
```

For unique column insertions, add accompanying unique indexes.

```sql
-- name column unique index
CREATE UNIQUE INDEX idx_frameworks_name ON frameworks (name);

-- url column unique index
CREATE UNIQUE INDEX idx_frameworks_url ON frameworks (url);
```

Seed the database with some data.

```sql
INSERT INTO frameworks (name, language, url, stars) VALUES ("Vue.js" , "JavaScript", "https://github.com/vuejs/vue", 203000);
INSERT INTO frameworks (name, language, url, stars) VALUES ("React", "JavaScript", "https://github.com/facebook/react", 206000);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Angular", "TypeScript", "https://github.com/angular/angular", 87400);
INSERT INTO frameworks (name, language, url, stars) VALUES ("ASP.NET Core", "C#", "https://github.com/dotnet/aspnetcore", 31400);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Express", "JavaScript", "https://github.com/expressjs/express", 60500);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Django", "Python", "https://github.com/django/django", 69800);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Ruby on Rails", "Ruby", "https://github.com/rails/rails", 52600);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Spring", "Java", "https://github.com/spring-projects/spring-framework", 51400);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Laravel", "PHP", "https://github.com/laravel/laravel", 73100);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Flask", "Python", "https://github.com/pallets/flask", 62500);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Ruby", "Ruby", "https://github.com/ruby/ruby", 41000);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Symfony", "PHP", "https://github.com/symfony/symfony", 28200);
INSERT INTO frameworks (name, language, url, stars) VALUES ("CodeIgniter", "PHP", "https://github.com/bcit-ci/CodeIgniter", 18200);
INSERT INTO frameworks (name, language, url, stars) VALUES ("CakePHP", "PHP", "https://github.com/cakephp/cakephp", 8600);
INSERT INTO frameworks (name, language, url, stars) VALUES ("Qwik", "TypeScript", "https://github.com/BuilderIO/qwik", 16400);
```

---

To clone and deploy this project to Vercel, click on the button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fturso-extended%2Fapp-top-web-frameworks&env=NUXT_TURSO_DB_URL,NUXT_TURSO_DB_AUTH_TOKEN)

[Top Web Frameworks]: https://es-nuxt-turso-basic.netlify.app/
[Nuxt]: https://nuxt.com/
[Turso]: https://turso.tech/
[Nuxt UI]: https://ui.nuxt.com/
[Netlify]: https://www.netlify.com/
[deployment documentation]: https://nuxt.com/docs/getting-started/deployment
[Install the Turso CLI]: https://docs.turso.tech/reference/turso-cli#installation
