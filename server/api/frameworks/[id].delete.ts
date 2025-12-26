export default defineEventHandler(async (event) => {
  const frameworkId = getRouterParam(event, 'id');

  if (!frameworkId) {
    throw createError({ statusCode: 400, message: 'Framework ID is required' });
  }

  console.log(`Deleting framework with ID: ${frameworkId}`);

  const client = useTurso();

  try {
    const result = await client.execute({
      sql: 'DELETE FROM frameworks WHERE id = ?',
      args: [frameworkId],
    });
    return {
      message: `Framework ${frameworkId} deleted (${result.rowsAffected} row(s) affected)`,
    };
  } catch (error: unknown) {
    console.error('(Server) Error deleting framework:', error);
  }
});
