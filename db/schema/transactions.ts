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
      userIdIdx: index('trc_user_id_idx').on(table.userId),
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
      userIdIdx: index('prv_user_id_idx').on(table.userId),
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
      providerIdIdx: index('ptc_provider_id_idx').on(table.providerId),
      categoryIdIdx: index('ptc_category_id_idx').on(table.categoryId),
      userIdIdx: index('ptc_user_id_idx').on(table.userId),
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
      accountIdIdx: index('trs_account_id_idx').on(table.accountId),
      dateIdx: index('trs_date_idx').on(table.date),
      userIdIdx: index('trs_user_id_idx').on(table.userId),
      categoryIdIdx: index('trs_category_id_idx').on(table.categoryId),
      providerIdIdx: index('trs_provider_id_idx').on(table.providerId),
      currencyIdIdx: index('trs_currency_id_idx').on(table.currencyId),
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
      transactionIdIdx: index('ttt_transaction_id_idx').on(table.transactionId),
      tagIdIdx: index('ttt_tag_id_idx').on(table.tagId),
      userIdIdx: index('ttt_user_id_idx').on(table.userId),
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
      transactionIdIdx: index('tta_transaction_id_idx').on(table.transactionId),
      attachementIdIdx: index('tta_attachment_id_idx').on(table.attachementId),
      userIdIdx: index('tta_user_id_idx').on(table.userId),
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
      userIdIdx: index('tse_user_id_idx').on(table.userId),
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
      transactionSetIdIdx: index('tst_transaction_set_id_idx').on(
        table.transactionSetId
      ),
      transactionIdIdx: index('tst_transaction_id_idx').on(table.transactionId),
      userIdIdx: index('tst_user_id_idx').on(table.userId),
    };
  }
);
