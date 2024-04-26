import { H3Error } from 'h3';
import { StatusCode } from '../types';

export class ValidationError extends H3Error {
  constructor(field: string) {
    super(`Invalid value: ${field}`);
    this.statusCode = StatusCode.BadRequest;
  }
}

export class UnauthorizedError extends H3Error {
  constructor() {
    super('Unauthorized');
    this.statusCode = StatusCode.Unauthorized;
  }
}

export function handleError(
  err: unknown,
  msg: string = 'Internal Server Error'
) {
  let code = StatusCode.InternalServerError;

  if (err instanceof H3Error) {
    code = err.statusCode;
  }

  return createError({
    status: code,
    statusMessage: msg,
    message: err instanceof Error ? err.message : String(err),
  });
}
