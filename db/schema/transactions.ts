import {
  doublePrecision,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  integer,
  serial,
  varchar,
  primaryKey,
  boolean,
} from 'drizzle-orm/pg-core';

import { accounts, attachments, currencies, tags, users } from '@/db/schema';
import { transactionType, transactionStatus } from '@/utils';

// Enums
export const transactionTypeEnum = pgEnum('transaction_type', transactionType);

export const transactionStatusEnum = pgEnum(
  'transaction_status',
  transactionStatus
);

// Models
export const transactionCategories = pgTable(
  'transaction_categories',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    name: varchar('name', { length: 256 }).notNull(),
    type: transactionTypeEnum('type').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
    };
  }
);

export const providers = pgTable(
  'providers',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    name: varchar('name', { length: 256 }).notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
    };
  }
);

export const providersToCategories = pgTable(
  'providers_to_categories',
  {
    providerId: integer('provider_id').references(() => providers.id),
    categoryId: integer('category_id').references(
      () => transactionCategories.id
    ),
    userId: text('user_id').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'provider_category_pk',
        columns: [table.userId, table.providerId, table.categoryId],
      }),
    };
  }
);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    description: text('description'),
    amount: doublePrecision('amount').notNull(),
    date: timestamp('transaction_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    type: transactionTypeEnum('type').notNull(),
    status: transactionStatusEnum('status').notNull().default('completed'),
    isTemplate: boolean('is_template').notNull().default(false),
    accountId: uuid('account_id').references(() => accounts.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    currencyId: integer('currency_id')
      .notNull()
      .references(() => currencies.id),
    categoryId: integer('category_id')
      .notNull()
      .references(() => transactionCategories.id),
    providerId: integer('provider_id').references(() => providers.id),
  },
  (table) => {
    return {
      accountIdIdx: index('account_id_idx').on(table.accountId),
      dateIdx: index('date_idx').on(table.date),
      userIdIdx: index('user_id_idx').on(table.userId),
      categoryIdIdx: index('category_id_idx').on(table.categoryId),
      providerIdIdx: index('provider_id_idx').on(table.providerId),
    };
  }
);

export const transactionsToTags = pgTable(
  'transactions_to_tags',
  {
    transactionId: uuid('transaction_id').references(() => transactions.id),
    tagId: integer('tag_id').references(() => tags.id),
    userId: text('user_id').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'transaction_tag_pk',
        columns: [table.userId, table.transactionId, table.tagId],
      }),
    };
  }
);

export const transactionsToAttachments = pgTable(
  'transactions_to_attachments',
  {
    transactionId: uuid('transaction_id').references(() => transactions.id),
    attachementId: uuid('attachment_id').references(() => attachments.id),
    userId: text('user_id').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'transaction_attachment_pk',
        columns: [table.userId, table.transactionId, table.attachementId],
      }),
    };
  }
);
