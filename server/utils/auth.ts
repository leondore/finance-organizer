import type { H3EventContext } from 'h3';

import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { eq } from 'drizzle-orm';

import { db } from './db';
import { users, sessions, emailVerificationTokens } from '~/db/schema';
import { Role } from '../types';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { createDate, TimeSpan } from 'oslo';

const EMAIL_TOKEN_LENGTH = 8;
const EMAIL_TOKEN_EXP_HOURS = 8;

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
      sameSite: 'lax',
    },
  },
  getSessionAttributes: (attributes) => {
    return {
      ipAddress: attributes.ip_address,
      userAgent: attributes.user_agent,
    };
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      role: attributes.role,
      emailVerified: attributes.email_verified,
    };
  },
});

export const isAdmin = (context: H3EventContext) => {
  return context.user?.role === Role.Admin;
};

export const generateEmailVerificationToken = async (
  userId: string,
  email: string
): Promise<string> => {
  await db
    .delete(emailVerificationTokens)
    .where(eq(emailVerificationTokens.userId, userId));

  const token = generateRandomString(
    EMAIL_TOKEN_LENGTH,
    alphabet('0-9', 'A-Z')
  );

  await db.insert(emailVerificationTokens).values({
    userId,
    token,
    email,
    expiresAt: createDate(new TimeSpan(EMAIL_TOKEN_EXP_HOURS, 'h')),
  });

  return token;
};
