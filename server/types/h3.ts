import type { Session, User } from 'lucia';
import type { Database } from './base';
import { Auth } from './auth';

declare module 'h3' {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
    db: Database;
    auth: Auth | null;
  }
}
