import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

import { isValidEmail } from '../utils/helpers';
import { users } from '~/db/schema';
import { db } from '../utils/db';
import { Role } from '../types';
import { handleError } from '../utils/errors';

const PWD_MIN_LENGTH = 8;
const PWD_MAX_LENGTH = 256;
const USER_ID_LENGTH = 15;

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
    password.length < PWD_MIN_LENGTH ||
    password.length > PWD_MAX_LENGTH
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid password',
    });
  }

  const userId = generateId(USER_ID_LENGTH);
  const hashedPassword = await new Argon2id().hash(password);

  try {
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
  } catch (error) {
    handleError(
      event,
      error,
      'An error occurred while trying to create the account. Please try again.'
    );
  }
});
