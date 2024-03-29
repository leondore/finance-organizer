import {
  doublePrecision,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  integer,
} from 'drizzle-orm/pg-core';

import { accounts, currencies, users } from '@/db/schema';
import { transactionType } from '@/utils';

// Enums
export const transactionTypeEnum = pgEnum('transaction_type', transactionType);

// Models
export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    description: text('description'),
    amount: doublePrecision('amount').notNull(),
    accountId: uuid('account_id').references(() => accounts.id),
    date: timestamp('transaction_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    type: transactionTypeEnum('type').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    currencyId: integer('currency_id')
      .notNull()
      .references(() => currencies.id),
  },
  (table) => {
    return {
      accountIdIdx: index('account_id_idx').on(table.accountId),
      dateIdx: index('date_idx').on(table.date),
      userIdIdx: index('user_id_idx').on(table.userId),
    };
  }
);
