import { eq } from 'drizzle-orm';
import { countries, profiles, roles, users } from '~/server/db/schema';
import { User } from '~/server/types';

export default defineEventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const db = event.context.db;
    if (!db) {
      throw ServerError();
    }

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw ValidationError('ID');
    }

    try {
      const [user]: User[] = await db
        .select({
          email: users.email,
          role: { id: roles.id, role: roles.role },
          profile: {
            firstName: profiles.firstName,
            lastName: profiles.lastName,
          },
          country: {
            code: countries.code,
            name: countries.name,
          },
        })
        .from(users)
        .where(eq(users.id, id))
        .innerJoin(roles, eq(users.roleId, roles.id))
        .innerJoin(profiles, eq(users.id, profiles.userId))
        .leftJoin(countries, eq(profiles.countryId, countries.id));
      return user;
    } catch (err) {
      throw handleError(err);
    }
  },
});
