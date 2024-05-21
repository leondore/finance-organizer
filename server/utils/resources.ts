import type { H3Event } from 'h3';
import { BaseTable, CreateBody, StatusCode } from '../types';

export async function store<T extends BaseTable, U extends Record<string, any>>(
  event: H3Event,
  resource: T,
  body: CreateBody<T>
): Promise<[Error | null, U]> {
  const db = event.context.db!;

  const [created] = await db.insert(resource).values(body).returning();
  let error = null;

  if (!created) {
    error = createError({
      statusCode: StatusCode.NotFound,
      statusMessage: 'Not found.',
      message: 'Could not create country.',
    });
  }

  return [error, created];
}
