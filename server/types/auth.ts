import { z } from 'zod';
import { userSchema } from '../db/schema/zod';

export type Auth = ReturnType<typeof generateAuthHandler>;

export type User = z.infer<typeof userSchema>;

export enum Role {
  Admin = 1,
  User = 2,
}
