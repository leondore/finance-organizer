import { UserSignup } from '~/types';

import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

import { isValidEmail } from '../utils/helpers';
import { profiles, users } from '~/db/schema';
import { db } from '../utils/db';
import { Role } from '../types';
import { handleError } from '../utils/errors';
import {
  generateEmailVerificationToken,
  sendEmailVerificationToken,
} from '../utils/auth';

const PWD_MIN_LENGTH = 8;
const PWD_MAX_LENGTH = 256;
const USER_ID_LENGTH = 15;

export default defineEventHandler(async (event) => {
  const { email, password, firstName, lastName } =
    await readBody<UserSignup>(event);

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email address',
    });
  }

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
    // Create a user
    await db.insert(users).values({
      id: userId,
      email,
      password: hashedPassword,
      roleId: Role.User,
    });

    // Create a profile
    await db.insert(profiles).values({
      userId,
      firstName,
      lastName,
    });

    const emailVerificationToken = await generateEmailVerificationToken(
      userId,
      email
    );
    await sendEmailVerificationToken(emailVerificationToken, email, firstName);

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
