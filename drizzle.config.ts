import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: [
    './server/db/schema/accounts.ts',
    './server/db/schema/auth.ts',
    './server/db/schema/base.ts',
    './server/db/schema/transactions.ts',
  ],
  out: './server/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NUXT_DATABASE_URL!,
  },
} satisfies Config;
