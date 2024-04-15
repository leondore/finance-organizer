import type { Role } from './auth';
import { auth } from '../utils/auth';

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseSessionAttributes: SessionAttributes;
    DatabaseUserAttributes: UserAttributes;
  }

  interface SessionAttributes {
    ip_address?: string;
    user_agent?: string;
  }

  interface UserAttributes {
    email: string;
    role: Role;
    email_verified: boolean;
  }
}
