import { StatusCode, type Country } from '~/server/types';
import { countries } from '~/server/db/schema';

export default defineEventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const db = event.context.db!;

    const { code, name } = await readBody<Country>(event);

    try {
      const [newCountry] = await db
        .insert(countries)
        .values({ code, name })
        .returning();

      if (!newCountry) {
        throw createError({
          statusCode: StatusCode.NotFound,
          statusMessage: 'Not found.',
          message: 'Could not create country.',
        });
      }

      return newCountry;
    } catch (err) {
      throw handleError(err);
    }
  },
});
