import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

import { db } from './db';
import { users, sessions } from '~/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
  }
}
