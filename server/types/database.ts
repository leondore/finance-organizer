import type { Placeholder, SQL } from 'drizzle-orm';
import type { PgInsertBase, PgTableWithColumns } from 'drizzle-orm/pg-core';
import type {
  PostgresJsDatabase,
  PostgresJsQueryResultHKT,
} from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';

export type Database = PostgresJsDatabase<typeof schema> | null;

export type BaseTable = PgTableWithColumns<{
  name: string;
  schema: undefined;
  dialect: 'pg';
  columns: Record<string, any>;
}>;

export type CreateBody<T extends BaseTable> = {
  [Key in keyof T['$inferInsert']]:
    | SQL<unknown>
    | Placeholder<string, any>
    | T['$inferInsert'][Key];
};

export type CreateReturn<T extends BaseTable> = Omit<
  PgInsertBase<
    T,
    PostgresJsQueryResultHKT,
    T['$inferSelect'],
    false,
    'returning'
  >,
  'returning'
>;
