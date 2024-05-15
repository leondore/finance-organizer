import { StatusCode } from '~/server/types';
import { inArray } from 'drizzle-orm';
import { countries } from '~/server/db/schema';

export default defineEventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const db = event.context.db!;

    const { ids } = await readBody<{ ids: number[] }>(event);

    try {
      const deleted = await db
        .delete(countries)
        .where(inArray(countries.id, ids))
        .returning();

      if (!deleted || !deleted.length) {
        throw createError({
          statusCode: StatusCode.NotFound,
          statusMessage: 'Not found.',
          message: 'Could not delete.',
        });
      }

      return deleted;
    } catch (err) {
      throw handleError(err);
    }
  },
});
