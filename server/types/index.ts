import type { Role } from '~/types';
import { auth } from '../utils/auth';

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseSessionAttributes: SessionAttributes;
    DatabaseUserAttributes: UserAttributes;
  }

  interface SessionAttributes {
    ip_address: string | null;
    user_agent: string | null;
  }

  interface UserAttributes {
    email: string;
    role: Role;
  }
}
