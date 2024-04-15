import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

import { isValidEmail } from '../utils/helpers';
import { users } from '~/db/schema';
import { db } from '../utils/db';
import { Role } from '../types';

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);

  const email = formData.get('email');
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email address',
    });
  }

  const password = formData.get('password');
  if (
    !password ||
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 256
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid password',
    });
  }

  const userId = generateId(15);
  const hashedPassword = await new Argon2id().hash(password);

  await db.insert(users).values({
    id: userId,
    email,
    password: hashedPassword,
    roleId: Role.User,
  });

  const clientUserAgent = getHeader(event, 'User-Agent');
  const clientIp = getRequestIP(event, { xForwardedFor: true });

  const session = await auth.createSession(userId, {
    ip_address: clientIp,
    user_agent: clientUserAgent,
  });
  appendHeader(
    event,
    'Set-Cookie',
    auth.createSessionCookie(session.id).serialize()
  );
});
