import { verifyRequestOrigin } from 'lucia';

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    const originHeader = getHeader(event, 'Origin') ?? null;
    const hostHeader = getHeader(event, 'Host') ?? null;
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return event.node.res.writeHead(403).end();
    }
  }

  try {
    const auth = generateAuthHandler(event.context.db);

    const sessionId = getCookie(event, auth.sessionCookieName) ?? null;
    if (!sessionId) {
      event.context.session = null;
      event.context.user = null;
      return;
    }

    const { session, user } = await auth.validateSession(sessionId);
    if (session && session.fresh) {
      appendResponseHeader(
        event,
        'Set-Cookie',
        auth.createSessionCookie(session.id).serialize()
      );
    }
    if (!session) {
      appendResponseHeader(
        event,
        'Set-Cookie',
        auth.createBlankSessionCookie().serialize()
      );
    }

    event.context.session = session;
    event.context.user = user;
    event.context.auth = auth;
  } catch (error) {
    event.context.session = null;
    event.context.user = null;
    event.context.auth = null;
  }
});
