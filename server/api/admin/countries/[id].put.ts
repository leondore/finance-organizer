import { StatusCode, type Country } from '~/server/types';
import { eq } from 'drizzle-orm';
import { countries } from '~/server/db/schema';

export default defineEventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const db = event.context.db!;

    const id = getRouterParam(event, 'id');
    if (!id || !Number.isNaN(id)) {
      throw ValidationError('Id');
    }

    const { code, name } = await readBody<Country>(event);

    try {
      const [updated] = await db
        .update(countries)
        .set({ code, name })
        .where(eq(countries.id, Number(id)))
        .returning();

      if (!updated) {
        throw createError({
          statusCode: StatusCode.NotFound,
          statusMessage: 'Not found.',
          message: 'Could not update country.',
        });
      }

      return updated;
    } catch (err) {
      throw handleError(err);
    }
  },
});
