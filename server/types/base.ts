import { z } from 'zod';
import { selectCountrySchema } from '../db/schema/zod';

export enum StatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

export type Country = z.infer<typeof selectCountrySchema>;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  body: string;
}
