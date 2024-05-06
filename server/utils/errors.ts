import { H3Error } from 'h3';
import { StatusCode } from '../types';

export const ValidationError = (field: string): H3Error => {
  return createError({
    statusCode: StatusCode.BadRequest,
    statusMessage: `Invalid value: ${field}`,
  });
};

export const UnauthorizedError = (err?: unknown): H3Error => {
  let message = 'Unauthorized';
  if (err instanceof H3Error) {
    message = message + ': ' + err.message;
  }

  return createError({
    statusCode: StatusCode.Unauthorized,
    statusMessage: message,
  });
};

export const ServerError = (err?: unknown): H3Error => {
  return createError({
    statusCode: StatusCode.InternalServerError,
    statusMessage: 'Internal Server Error',
    message: err instanceof Error ? err.message : String(err),
  });
};

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
