import type { Auth, Role } from './auth';

declare module 'lucia' {
  interface Register {
    Lucia: Auth;
    DatabaseSessionAttributes: SessionAttributes;
    DatabaseUserAttributes: UserAttributes;
  }

  interface SessionAttributes {
    ipAddress?: string;
    userAgent?: string;
  }

  interface UserAttributes {
    email: string;
    roleId: Role;
    emailVerified: boolean;
  }
}
