import {
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  index,
  uuid,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';

import { currencies, tags, users } from '.';
import { accountCategoryOptions } from '../../utils';

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
    code: varchar('code', { length: 64 }),
    logoId: uuid('logo_id'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      userIdIdx: index('institutions_user_id_idx').on(table.userId),
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
      userIdIdx: index('accounts_user_id_idx').on(table.userId),
      categoryIdIdx: index('accounts_category_id_idx').on(table.categoryId),
    };
  }
);

export const accountsToTags = pgTable(
  'accounts_to_tags',
  {
    accountId: uuid('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'accounts_to_tags_pk',
        columns: [table.userId, table.accountId, table.tagId],
      }),
      accountIdIdx: index('accounts_to_tags_account_id_idx').on(
        table.accountId
      ),
      tagIdIdx: index('accounts_to_tags_tag_id_idx').on(table.tagId),
      userIdIdx: index('accounts_to_tags_user_id_idx').on(table.userId),
    };
  }
);
