import type { Role } from './auth';
import { auth } from '../utils/auth';

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseSessionAttributes: SessionAttributes;
    DatabaseUserAttributes: UserAttributes;
  }

  interface SessionAttributes {
    ipAddress?: string;
    userAgent?: string;
  }

  interface UserAttributes {
    email: string;
    role: Role;
    emailVerified: boolean;
  }
}
