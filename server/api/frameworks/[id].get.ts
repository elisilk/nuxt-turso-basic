export default defineEventHandler(async (event) => {
  const frameworkId = getRouterParam(event, 'id');

  if (!frameworkId) {
    throw createError({
      statusCode: 400,
      message: 'Framework ID is required',
    });
  }

  console.log(`Getting framework with ID: ${frameworkId}`);

  const client = useTurso();

  try {
    const result = await client.execute({
      sql: 'SELECT * FROM frameworks WHERE id = ?',
      args: [frameworkId],
    });
    return result.rows[0];
  } catch (error) {
    console.error(`(Server) Error fetching framework (${frameworkId}):`, error);
  }
});
