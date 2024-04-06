import type { Session, User } from 'lucia';

declare module 'h3' {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
