import { eq } from 'drizzle-orm';
import { users } from '~/server/db/schema';
import { Role, StatusCode, User } from '~/server/types';

export default defineEventHandler({
  onRequest: [admin],
  handler: async (event) => {
    const db = event.context.db!;

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw ValidationError('Id');
    }

    const { roleId } = await readBody<{ roleId: Role }>(event);

    try {
      const [updatedUser]: { id: User['id']; email: User['email'] }[] = await db
        .update(users)
        .set({
          roleId,
        })
        .where(eq(users.id, id))
        .returning({ id: users.id, email: users.email });

      if (!updatedUser) {
        throw createError({
          statusCode: StatusCode.NotFound,
          statusMessage: 'Not found.',
          message: 'Could not update user.',
        });
      }

      return updatedUser;
    } catch (err) {
      throw handleError(err);
    }
  },
});
