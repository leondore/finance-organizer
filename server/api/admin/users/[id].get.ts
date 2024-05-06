import { ServerError } from '~/server/utils/errors';

export default defineEventHandler(async (event) => {
  if (!isAdmin(event.context)) {
    throw UnauthorizedError();
  }

  const db = event.context.db;
  if (!db) {
    throw ServerError();
  }
});
