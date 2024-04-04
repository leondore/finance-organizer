import {
  char,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
  text,
  index,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { users } from '.';

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
      codeIdx: uniqueIndex('cur_code_idx').on(table.code),
    };
  }
);

export const countries = pgTable(
  'countries',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    code: varchar('code', { length: 8 }).notNull().unique(),
  },
  (table) => {
    return {
      codeIdx: uniqueIndex('cnt_code_idx').on(table.code),
    };
  }
);

export const tags = pgTable(
  'tags',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    name: varchar('name', { length: 256 }).notNull(),
    color: varchar('color', { length: 32 }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      userIdIdx: index('tag_user_id_idx').on(table.userId),
    };
  }
);

export const attachments = pgTable(
  'attachments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    name: varchar('name', { length: 256 }).notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      userIdIdx: index('atc_user_id_idx').on(table.userId),
    };
  }
);
