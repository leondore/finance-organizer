import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL!;

const client = postgres(databaseUrl, { max: 1 });
const db = drizzle(client);

async function main() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: 'db/migrations' });
    console.log('Migration successful!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed');
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
