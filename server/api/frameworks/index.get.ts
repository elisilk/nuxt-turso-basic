export default defineEventHandler(async (event) => {
  const client = useTurso();
  const result = await client.execute(
    'SELECT * FROM frameworks ORDER BY stars DESC'
  );

  const cityHeader = getHeader(event, 'x-vercel-ip-city');
  const city = cityHeader ? decodeURIComponent(cityHeader) : '-';

  return {
    message: 'Frameworks fetched!',
    data: {
      frameworks: result.rows,
      city,
    },
  };
});
