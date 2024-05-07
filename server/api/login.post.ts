import type { UserLogin } from '~/types';

import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';

import { users } from '~/server/db/schema';
import { userMeta } from '../utils/auth';
import { StatusCode } from '../types';
import { ServerError } from '../utils/errors';

export default defineEventHandler(async (event) => {
  const db = event.context.db;
  const auth = event.context.auth;
  if (!db || !auth) {
    throw ServerError();
  }

  const { email, password } = await readBody<UserLogin>(event);

  if (!email || typeof email !== 'string') {
    throw ValidationError('Email Address');
  }

  if (!password || typeof password !== 'string') {
    throw ValidationError('Password');
  }

  const [user] = await db
    .select({ id: users.id, email: users.email, password: users.password })
    .from(users)
    .where(eq(users.email, email));
  if (!user) {
    throw createError({
      statusCode: StatusCode.BadRequest,
      statusMessage: 'Invalid email or password',
    });
  }

  const isValidPassword = await new Argon2id().verify(user.password, password);
  if (!isValidPassword) {
    throw createError({
      statusCode: StatusCode.BadRequest,
      statusMessage: 'Invalid email or password',
    });
  }

  const { clientUserAgent, clientIp } = userMeta(event);

  const session = await auth.createSession(user.id, {
    ipAddress: clientIp,
    userAgent: clientUserAgent,
  });
  appendHeader(
    event,
    'Set-Cookie',
    auth.createSessionCookie(session.id).serialize()
  );

  await auth.deleteExpiredSessions();
});
