import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL!;

const client = neon(databaseUrl);
const db = drizzle(client);

async function main() {
  try {
    console.log('Production | Running migrations...');
    await migrate(db, { migrationsFolder: 'db/migrations' });
    console.log('Production | Migration successful!');
    process.exit(0);
  } catch (err) {
    console.error('Production | Migration failed');
    console.error(err);
    process.exit(1);
  }
}

main();
