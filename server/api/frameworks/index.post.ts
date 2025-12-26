import { Filter } from 'bad-words';

export default defineEventHandler(async (event) => {
  const { name, language, url, stars } = await readBody(event);

  if (!name || !language || !url || !stars)
    throw createError({
      message: 'Missing fields!',
      statusCode: 400,
    });

  const client = useTurso();
  const filter = new Filter();

  await client.execute({
    sql: 'INSERT INTO frameworks (name, language, url, stars) VALUES (?, ?, ?, ?)',
    args: [
      filter.clean(name),
      filter.clean(language),
      filter.clean(url),
      stars,
    ],
  });

  const framework = await client.execute({
    sql: 'SELECT * FROM frameworks WHERE url = ?',
    args: [url],
  });

  return {
    message: 'Framework added!',
    data: framework.rows,
  };
});
