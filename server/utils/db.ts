import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';
import {
  NeonHttpDatabase,
  drizzle as drizzleNeon,
} from 'drizzle-orm/neon-http';
import {
  type PostgresJsDatabase,
  drizzle as drizzlePg,
} from 'drizzle-orm/postgres-js';

import * as schema from '../../db/schema';

const config = useRuntimeConfig();

let pgsql:
  | NeonHttpDatabase<typeof schema>
  | PostgresJsDatabase<typeof schema>
  | null = null;

if (!pgsql) {
  if (typeof config.databaseUrl === 'undefined' || config.databaseUrl === '') {
    throw new Error('Database URL is missing');
  }

  if (config.env === 'production') {
    const client = neon(config.databaseUrl);
    pgsql = drizzleNeon(client, { schema });
  } else {
    const client = postgres(config.databaseUrl);
    pgsql = drizzlePg(client, { schema });
  }
}

export const db = pgsql;
