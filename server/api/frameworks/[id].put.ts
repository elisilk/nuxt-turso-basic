import { Filter } from 'bad-words';

export default defineEventHandler(async (event) => {
  const frameworkId = getRouterParam(event, 'id');
  if (!frameworkId) {
    throw createError({ statusCode: 400, message: 'Framework ID is required' });
  }

  const { name, language, url, stars } = await readBody(event);
  if (!name || !language || !url || !stars)
    throw createError({
      message: 'Missing fields!',
      statusCode: 400,
    });

  // const { newName } = await readBody(event);
  // if (typeof newName !== 'string') {
  //   throw createError({
  //     statusCode: 400,
  //     message: 'Framework new name is required and must be a string',
  //   });
  // }

  const client = useTurso();
  const filter = new Filter();

  try {
    const result = await client.execute({
      sql: 'UPDATE frameworks SET name = :newName, language = :newLanguage, url = :newUrl, stars = :newStars WHERE id = :frameworkId',
      args: {
        newName: filter.clean(name),
        newLanguage: filter.clean(language),
        newUrl: filter.clean(url),
        newStars: stars,
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
