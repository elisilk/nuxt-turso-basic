export default defineEventHandler(async () => {
  console.log('Getting frameworks list');

  const client = useTurso();

  try {
    const result = await client.execute(
      'SELECT * FROM frameworks ORDER BY stars DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('(Server) Error fetching frameworks list:', error);
  }
});
