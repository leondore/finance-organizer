import { H3Error } from 'h3';

export class ValidationError extends H3Error {
  constructor(field: string) {
    super(`Invalid value for field: ${field}`);
    this.statusCode = 400;
  }
}

export function handleError(
  err: unknown,
  prefix: string = 'Internal Server Error'
) {
  let message = prefix;
  let code = 500;

  if (err instanceof Error) {
    message += ` Full error message: ${err.message}`;
  }

  if (err instanceof H3Error) {
    code = err.statusCode;
  }

  return createError({
    status: code,
    statusMessage: message,
  });
}
