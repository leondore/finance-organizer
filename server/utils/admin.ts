import { Role } from '../types';

export default defineEventHandler((event) => {
  if (event.context.user?.role !== Role.Admin) {
    throw UnauthorizedError();
  }
});
