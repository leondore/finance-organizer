import {
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  index,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { accountCategoryOptions } from '@/utils';
import { currencies, users } from '@/db/schema';

// Enums
export const accountCategoryEnum = pgEnum(
  'account_category',
  accountCategoryOptions
);

// Models
export const accountCategories = pgTable('account_categories', {
  id: serial('id').primaryKey(),
  name: accountCategoryEnum('category').notNull(),
  description: text('description'),
});

export const institutions = pgTable(
  'institutions',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    name: varchar('name', { length: 256 }).notNull(),
    code: varchar('code', { length: 64 }).notNull().unique(),
    logoUrl: varchar('logo_url', { length: 256 }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      codeIdx: uniqueIndex('code_idx').on(table.code),
      userIdIdx: index('user_id_idx').on(table.userId),
    };
  }
);

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    name: varchar('name', { length: 256 }).notNull(),
    balance: doublePrecision('balance').notNull().default(0),
    description: text('description'),
    categoryId: integer('category_id')
      .notNull()
      .references(() => accountCategories.id),
    accountNumber: varchar('account_number', { length: 64 }),
    institutionId: integer('institution_id').references(() => institutions.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    currencyId: integer('currency_id')
      .notNull()
      .references(() => currencies.id),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
    };
  }
);
