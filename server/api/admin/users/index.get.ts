import { eq } from 'drizzle-orm';
import { roles, users, type User } from '~/db/schema';

export default defineEventHandler(async (event) => {
  if (!isAdmin(event.context)) {
    throw UnauthorizedError();
  }

  try {
    const results: User[] = await db
      .select({
        id: users.id,
        createdAt: users.createdAt,
        email: users.email,
        emailVerified: users.emailVerified,
        role: { id: roles.id, role: roles.role },
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id));
    return results;
  } catch (err) {
    throw handleError(err);
  }
});
