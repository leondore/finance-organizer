import type { Country } from '~/server/types';
import { countries } from '~/server/db/schema';

export default defineEventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const db = event.context.db!;

    try {
      const results: Country[] = await db
        .select({
          id: countries.id,
          code: countries.code,
          name: countries.name,
        })
        .from(countries);
      return results;
    } catch (err) {
      throw handleError(err);
    }
  },
});
