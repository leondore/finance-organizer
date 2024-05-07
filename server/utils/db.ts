import type { Database } from '../types';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from '../db/schema';

export function useDB(): Database {
  const config = useRuntimeConfig();

  if (typeof config.databaseUrl === 'undefined' || config.databaseUrl === '') {
    return null;
  }

  const client = postgres(config.databaseUrl);
  return drizzle(client, { schema });
}
