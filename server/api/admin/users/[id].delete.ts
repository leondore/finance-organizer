import { eq } from 'drizzle-orm';
import { users } from '~/server/db/schema';
import { StatusCode, User } from '~/server/types';

export default defineEventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const db = event.context.db;
    if (!db) {
      throw ServerError();
    }

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw ValidationError('Id');
    }

    try {
      const [deletedUser]: { id: User['id']; email: User['email'] }[] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning({ id: users.id, email: users.email });

      if (!deletedUser) {
        throw createError({
          statusCode: StatusCode.NotFound,
          statusMessage: 'Not found.',
          message: 'Could not delete user.',
        });
      }

      return deletedUser;
    } catch (err) {
      throw handleError(err);
    }
  },
});
