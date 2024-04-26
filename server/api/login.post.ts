import type { UserLogin } from '~/types';

import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';

import { users } from '~/db/schema';
import { userMeta } from '../utils/auth';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<UserLogin>(event);

  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email Address');
  }

  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password');
  }

  const [user] = await db
    .select({ id: users.id, email: users.email, password: users.password })
    .from(users)
    .where(eq(users.email, email));
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email or password',
    });
  }

  const isValidPassword = await new Argon2id().verify(user.password, password);
  if (!isValidPassword) {
    throw createError({
      statusCode: 400,
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

  setResponseStatus(event, 200, 'Login Successful');
});