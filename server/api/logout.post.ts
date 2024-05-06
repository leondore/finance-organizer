import { StatusCode } from '../types';
import { ServerError } from '../utils/errors';

export default defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!auth) {
    throw ServerError();
  }

  if (!event.context.session) {
    throw createError({
      statusCode: StatusCode.Forbidden,
      statusMessage: 'No active session',
    });
  }

  await auth.invalidateSession(event.context.session.id);
  appendHeader(
    event,
    'Set-Cookie',
    auth.createBlankSessionCookie().serialize()
  );
});
