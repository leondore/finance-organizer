import type { H3Event, H3EventContext } from 'h3';

import { Lucia, SessionAttributes, User, UserAttributes } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { eq } from 'drizzle-orm';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { createDate, isWithinExpirationDate, TimeSpan } from 'oslo';

import { db } from './db';
import { users, sessions, emailVerificationTokens } from '~/db/schema';
import { Role } from '../types';

const EMAIL_TOKEN_LENGTH = 8;
const EMAIL_TOKEN_EXP_HOURS = 8;

const config = useRuntimeConfig();

const authHandlerParams = {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
      sameSite: 'lax',
    },
  },
  getSessionAttributes: (attributes: SessionAttributes) => {
    return {
      ipAddress: attributes.ipAddress,
      userAgent: attributes.userAgent,
    };
  },
  getUserAttributes: (attributes: UserAttributes) => {
    return {
      email: attributes.email,
      role: attributes.role,
      emailVerified: attributes.emailVerified,
    };
  },
} as const;

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const auth = new Lucia(adapter, authHandlerParams);

export const isAdmin = (context: H3EventContext) => {
  return context.user?.role === Role.Admin;
};

export const userMeta = (
  event: H3Event
): { clientUserAgent: string | undefined; clientIp: string | undefined } => {
  const clientUserAgent = getHeader(event, 'User-Agent');
  const clientIp = getRequestIP(event, { xForwardedFor: true });

  return { clientUserAgent, clientIp };
};

export const generateAuthHandler = (
  database: typeof db
): Lucia<
  ReturnType<(typeof authHandlerParams)['getSessionAttributes']>,
  ReturnType<(typeof authHandlerParams)['getUserAttributes']>
> => {
  const adapter = new DrizzlePostgreSQLAdapter(database, sessions, users);
  return new Lucia(adapter, authHandlerParams);
};

export const generateEmailVerificationToken = async (
  userId: string,
  email: string,
  database: typeof db = db
): Promise<string> => {
  await database
    .delete(emailVerificationTokens)
    .where(eq(emailVerificationTokens.userId, userId));

  const token = generateRandomString(EMAIL_TOKEN_LENGTH, alphabet('0-9'));

  await database.insert(emailVerificationTokens).values({
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

    Click here ${config.baseUrl}/email-verification to open the email verification screen.

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

export const verifyVerficationToken = async (
  user: User,
  token: string
): Promise<boolean> => {
  try {
    const [dbToken] = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, user.id));

    if (!dbToken || dbToken.token !== token) {
      return false;
    }

    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, user.id));

    if (!isWithinExpirationDate(dbToken.expiresAt)) {
      return false;
    }

    if (dbToken.email !== user.email) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
