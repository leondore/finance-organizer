import {
  char,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

// Models
export const currencies = pgTable(
  'currencies',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    code: varchar('code', { length: 8 }).notNull().unique(),
    symbol: char('symbol', { length: 8 }),
  },
  (table) => {
    return {
      codeIdx: uniqueIndex('code_idx').on(table.code),
    };
  }
);
