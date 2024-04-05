import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: [
    './db/schema/accounts.ts',
    './db/schema/auth.ts',
    './db/schema/base.ts',
    './db/schema/transactions.ts',
  ],
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NUXT_DATABASE_URL!,
  },
} satisfies Config;
