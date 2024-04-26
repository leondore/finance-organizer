import { StatusCode } from '../types';

export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: StatusCode.Forbidden,
      statusMessage: 'No active session',
    });
  }
});
