import type { User } from '~/server/types';
import { eq } from 'drizzle-orm';
import { countries, profiles, roles, users } from '~/server/db/schema';

export default defineEventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const db = event.context.db!;

    try {
      const results: User[] = await db
        .select({
          id: users.id,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          email: users.email,
          emailVerified: users.emailVerified,
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
        .innerJoin(roles, eq(users.roleId, roles.id))
        .innerJoin(profiles, eq(users.id, profiles.userId))
        .leftJoin(countries, eq(profiles.countryId, countries.id));
      return results;
    } catch (err) {
      throw handleError(err);
    }
  },
});
