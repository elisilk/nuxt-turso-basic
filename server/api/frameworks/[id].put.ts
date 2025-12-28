export default defineEventHandler(async (event) => {
  const frameworkId = getRouterParam(event, 'id');
  if (!frameworkId) {
    throw createError({ statusCode: 400, message: 'Framework ID is required' });
  }

  const { newName } = await readBody(event);
  if (typeof newName !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Framework new name is required and must be a string',
    });
  }

  const client = useTurso();

  try {
    const result = await client.execute({
      sql: 'UPDATE frameworks SET name = :newName WHERE id = :frameworkId',
      args: {
        newName,
        frameworkId,
      },
    });
    if (result.rowsAffected > 0) {
      return {
        success: true,
        message: `Framework with ID ${frameworkId} updated (${result.rowsAffected} row(s) affected)`,
      };
    } else {
      return {
        success: false,
        message: `Framework with ID ${frameworkId} not found or no changes made.`,
      };
    }
  } catch (error: unknown) {
    console.error('(Server) Error updating framework:', error);
    return { success: false, message: 'Failed to update framework.' };
  }
});
