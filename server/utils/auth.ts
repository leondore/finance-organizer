import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import type { H3EventContext } from 'h3';

import { db } from './db';
import { users, sessions } from '~/db/schema';
import { Role } from '../types';

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
    };
  },
});

export const isAdmin = (context: H3EventContext) => {
  return context.user?.role === Role.Admin;
};
