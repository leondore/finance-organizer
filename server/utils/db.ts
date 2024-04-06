import postgres from 'postgres';
import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';

import * as schema from '../../db/schema';

const config = useRuntimeConfig();

let pgsql: PostgresJsDatabase<typeof schema> | null = null;

if (!pgsql) {
  if (typeof config.databaseUrl === 'undefined' || config.databaseUrl === '') {
    throw new Error('Database URL is missing');
  }

  const client = postgres(config.databaseUrl);
  pgsql = drizzle(client, { schema });
}

export const db = pgsql;
