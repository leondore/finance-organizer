import { H3Error } from 'h3';

export class ValidationError extends H3Error {
  constructor(field: string) {
    super(`Invalid value for field: ${field}`);
    this.statusCode = 400;
  }
}

export function handleError(
  err: unknown,
  msg: string = 'Internal Server Error'
) {
  let code = 500;

  if (err instanceof H3Error) {
    code = err.statusCode;
  }

  return createError({
    status: code,
    statusMessage: msg,
    message: err instanceof Error ? err.message : String(err),
  });
}
