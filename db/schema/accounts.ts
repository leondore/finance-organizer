import {
  integer,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const accounts = pgTable(
  'account',
  {
    id: integer('id').primaryKey(),
    uuid: uuid('uuid').unique().defaultRandom(),
    name: varchar('name', { length: 256 }).notNull(),
  },
  (table) => {
    return {
      uuidIdx: uniqueIndex('uuid_idx').on(table.uuid),
    };
  }
);
