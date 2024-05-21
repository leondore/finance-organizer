import type { Country } from '~/server/types';
import { countries } from '~/server/db/schema';
import { store } from '~/server/utils/resources';

export default defineEventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const { code, name } = await readBody<Country>(event);

    const [error, newCountry] = await store<typeof countries, Country>(
      event,
      countries,
      {
        code,
        name,
      }
    );
    if (error) {
      throw handleError(error);
    }

    return newCountry;
  },
});
