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

const config = useRuntimeConfig();

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
      ipAddress: attributes.ipAddress,
      userAgent: attributes.userAgent,
    };
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      role: attributes.role,
      emailVerified: attributes.emailVerified,
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

  const token = generateRandomString(EMAIL_TOKEN_LENGTH, alphabet('0-9'));

  await db.insert(emailVerificationTokens).values({
    userId,
    token,
    email,
    expiresAt: createDate(new TimeSpan(EMAIL_TOKEN_EXP_HOURS, 'h')),
  });

  return token;
};

export const sendEmailVerificationToken = async (
  code: string,
  email: string,
  name: string = 'user'
) => {
  const verificationEmailBody = `
    Greetings ${name},

    Your verfication code is ${code}.

    Enter this code within ${config.appName} to verify your email and activate your account.

    Click here ${config.baseUrl}/verify-email to open the email verification screen.

    If you have any questions, please contact us at ${config.public.fromAddress}.

    We're glad you're here!
  `;

  // Send email
  return await sendEmail({
    to: email,
    subject: 'Please Verify Your Email',
    body: verificationEmailBody,
  });
};
