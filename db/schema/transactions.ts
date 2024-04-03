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

import { accounts, attachments, currencies, tags, users } from '.';
import { transactionType, transactionStatus } from '../../utils';

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
      userIdIdx: index('transaction_categories_user_id_idx').on(table.userId),
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
      userIdIdx: index('providers_user_id_idx').on(table.userId),
    };
  }
);

export const providersToCategories = pgTable(
  'providers_to_categories',
  {
    providerId: integer('provider_id')
      .notNull()
      .references(() => providers.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => transactionCategories.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'provider_to_category_pk',
        columns: [table.userId, table.providerId, table.categoryId],
      }),
      providerIdIdx: index('provider_to_category_provider_id_idx').on(
        table.providerId
      ),
      categoryIdIdx: index('provider_to_category_category_id_idx').on(
        table.categoryId
      ),
      userIdIdx: index('provider_to_category_user_id_idx').on(table.userId),
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
    isRecurring: boolean('is_recurring').notNull().default(false),
    recurringCron: varchar('recurring_cron', { length: 256 }),
    recurringUntil: timestamp('recurring_until', { withTimezone: true }),
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
      accountIdIdx: index('transactions_account_id_idx').on(table.accountId),
      dateIdx: index('transactions_date_idx').on(table.date),
      userIdIdx: index('transactions_user_id_idx').on(table.userId),
      categoryIdIdx: index('transactions_category_id_idx').on(table.categoryId),
      providerIdIdx: index('transactions_provider_id_idx').on(table.providerId),
      currencyIdIdx: index('transactions_currency_id_idx').on(table.currencyId),
    };
  }
);

export const transactionsToTags = pgTable(
  'transactions_to_tags',
  {
    transactionId: uuid('transaction_id')
      .notNull()
      .references(() => transactions.id, { onDelete: 'cascade' }),
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
        name: 'transaction_to_tag_pk',
        columns: [table.userId, table.transactionId, table.tagId],
      }),
      transactionIdIdx: index('transactions_to_tags_transaction_id_idx').on(
        table.transactionId
      ),
      tagIdIdx: index('transactions_to_tags_tag_id_idx').on(table.tagId),
      userIdIdx: index('transactions_to_tags_user_id_idx').on(table.userId),
    };
  }
);

export const transactionsToAttachments = pgTable(
  'transactions_to_attachments',
  {
    transactionId: uuid('transaction_id')
      .notNull()
      .references(() => transactions.id, { onDelete: 'cascade' }),
    attachementId: uuid('attachment_id')
      .notNull()
      .references(() => attachments.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'transaction_to_attachment_pk',
        columns: [table.userId, table.transactionId, table.attachementId],
      }),
      transactionIdIdx: index(
        'transactions_to_attachments_transaction_id_idx'
      ).on(table.transactionId),
      attachementIdIdx: index(
        'transactions_to_attachments_attachment_id_idx'
      ).on(table.attachementId),
      userIdIdx: index('transactions_to_attachments_user_id_idx').on(
        table.userId
      ),
    };
  }
);

export const transactionSets = pgTable(
  'transaction_sets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 256 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('transaction_sets_user_id_idx').on(table.userId),
    };
  }
);

export const transactionSetsToTransactions = pgTable(
  'transaction_sets_to_transactions',
  {
    transactionSetId: uuid('transaction_set_id')
      .notNull()
      .references(() => transactionSets.id, { onDelete: 'cascade' }),
    transactionId: uuid('transaction_id')
      .notNull()
      .references(() => transactions.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'transaction_set_to_transaction_pk',
        columns: [table.userId, table.transactionSetId, table.transactionId],
      }),
      transactionSetIdIdx: index(
        'transaction_sets_to_transactions_transaction_set_id_idx'
      ).on(table.transactionSetId),
      transactionIdIdx: index(
        'transaction_sets_to_transactions_transaction_id_idx'
      ).on(table.transactionId),
      userIdIdx: index('transaction_sets_to_transactions_user_id_idx').on(
        table.userId
      ),
    };
  }
);
