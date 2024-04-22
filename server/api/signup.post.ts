import { UserSignup } from '~/types';

import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

import { isValidEmail } from '../utils/helpers';
import { profiles, users } from '~/db/schema';
import { db } from '../utils/db';
import { Role } from '../types';
import { handleError, ValidationError } from '../utils/errors';
import {
  generateAuthHandler,
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
    throw new ValidationError('Email Address');
  }

  if (
    !password ||
    typeof password !== 'string' ||
    password.length < PWD_MIN_LENGTH ||
    password.length > PWD_MAX_LENGTH
  ) {
    throw new ValidationError('Password');
  }

  if (!firstName || typeof firstName !== 'string') {
    throw new ValidationError('First Name');
  }

  const userId = generateId(USER_ID_LENGTH);
  const hashedPassword = await new Argon2id().hash(password);

  await db.transaction(async (tx) => {
    try {
      // Create a user
      await tx.insert(users).values({
        id: userId,
        email,
        password: hashedPassword,
        roleId: Role.User,
      });

      // Create a profile
      await tx.insert(profiles).values({
        userId,
        firstName,
        lastName,
      });

      const emailVerificationToken = await generateEmailVerificationToken(
        userId,
        email,
        tx
      );
      await sendEmailVerificationToken(
        emailVerificationToken,
        email,
        firstName
      );

      const clientUserAgent = getHeader(event, 'User-Agent');
      const clientIp = getRequestIP(event, { xForwardedFor: true });

      const auth = generateAuthHandler(tx);
      const session = await auth.createSession(userId, {
        ipAddress: clientIp,
        userAgent: clientUserAgent,
      });
      appendHeader(
        event,
        'Set-Cookie',
        auth.createSessionCookie(session.id).serialize()
      );

      setResponseStatus(event, 201, 'User created');
    } catch (error) {
      throw handleError(error, 'Failed to create user.');
    }
  });
});
