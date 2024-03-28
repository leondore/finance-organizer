import {
  doublePrecision,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { accountCategoryOptions } from '@/utils';

// Enums
export const accountCategoryEnum = pgEnum(
  'account_category',
  accountCategoryOptions
);

// Models
export const accountCategories = pgTable('account_category', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: accountCategoryEnum('category').notNull(),
  description: text('description'),
});

export const accounts = pgTable('account', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  balance: doublePrecision('balance').notNull().default(0),
  description: text('description'),
  categoryId: uuid('category_id').references(() => accountCategories.id),
  accountNumber: varchar('account_number', { length: 64 }),
});
