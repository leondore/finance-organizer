import { eq } from 'drizzle-orm';

import { users } from '~/db/schema';
import { userMeta, verifyVerficationToken } from '../utils/auth';
import { UnauthorizedError } from '../utils/errors';
import { db } from '../utils/db';

export default defineEventHandler(async (event) => {
  if (!event.context.session || !event.context.session.id) {
    throw UnauthorizedError();
  }

  const { user } = await auth.validateSession(event.context.session?.id);
  if (!user) {
    throw UnauthorizedError();
  }

  const { code } = await readBody<{ code: string }>(event);
  if (!code || typeof code !== 'string') {
    throw ValidationError('Verification Code');
  }

  const validCode = await verifyVerficationToken(user, code);
  if (!validCode) {
    throw ValidationError('Verification Code');
  }

  const { clientUserAgent, clientIp } = userMeta(event);

  await auth.invalidateUserSessions(user.id);
  await db
    .update(users)
    .set({ emailVerified: true, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  const session = await auth.createSession(user.id, {
    ipAddress: clientIp,
    userAgent: clientUserAgent,
  });
  appendHeader(
    event,
    'Set-Cookie',
    auth.createSessionCookie(session.id).serialize()
  );
});
