import { eq } from 'drizzle-orm';
import { countries, profiles, roles, users, type User } from '~/db/schema';
import { ServerError } from '~/server/utils/errors';

export default defineEventHandler(async (event) => {
  if (!isAdmin(event.context)) {
    throw UnauthorizedError();
  }

  const db = event.context.db;
  if (!db) {
    throw ServerError();
  }

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
});
