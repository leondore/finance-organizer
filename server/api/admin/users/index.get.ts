import { eq } from 'drizzle-orm';
import { profiles, roles, users, type User } from '~/db/schema';

export default defineEventHandler(async (event) => {
  if (!isAdmin(event.context)) {
    throw UnauthorizedError();
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
        name: { firstName: profiles.firstName, lastName: profiles.lastName },
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .innerJoin(profiles, eq(users.id, profiles.userId));
    return results;
  } catch (err) {
    throw handleError(err);
  }
});
