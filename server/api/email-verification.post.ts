import { UnauthorizedError } from '../utils/errors';

export default defineEventHandler(async (event) => {
  if (!event.context.session || !event.context.session.id) {
    throw new UnauthorizedError();
  }

  const { user } = await auth.validateSession(event.context.session?.id);
  if (!user) {
    throw new UnauthorizedError();
  }

  const { code } = await readBody<{ code: string }>(event);
  if (!code || typeof code !== 'string') {
    throw new ValidationError('Verification Code');
  }
});
