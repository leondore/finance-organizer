import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { countries } from '.';

// Models
export const roles = pgTable(
  'roles',
  {
    id: serial('id').primaryKey(),
    role: varchar('role', { length: 32 }).notNull().unique(),
  },
  (table) => {
    return {
      roleIdx: uniqueIndex('rol_role_idx').on(table.role),
    };
  }
);

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    email: varchar('email', { length: 256 }).unique().notNull(),
    password: text('password').notNull(),
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id),
    emailVerified: boolean('email_verified').notNull().default(false),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('usr_email_idx').on(table.email),
    };
  }
);

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  ipAddress: varchar('ip_address', { length: 64 }),
  userAgent: text('user_agent'),
});

export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const profiles = pgTable(
  'profiles',
  {
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    firstName: varchar('first_name', { length: 64 }).notNull(),
    lastName: varchar('last_name', { length: 64 }),
    phone: varchar('phone', { length: 16 }),
    avatarId: uuid('avatar_id'),
    countryId: integer('country_id').references(() => countries.id),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'profile_pk',
        columns: [table.userId],
      }),
      firstNameLastNameIdx: index('prf_fname_lname_idx').on(
        table.firstName,
        table.lastName
      ),
    };
  }
);

export const userSettings = pgTable(
  'user_settings',
  {
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    key: varchar('key', { length: 255 }).notNull(),
    value: text('value'),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'user_settings_pk',
        columns: [table.userId, table.key],
      }),
    };
  }
);

// Zod Schemas
const selectUserSchema = createSelectSchema(users).omit({
  password: true,
  updatedAt: true,
  roleId: true,
});
const selectRoleSchema = createSelectSchema(roles);
const userSchema = selectUserSchema.merge(z.object({ role: selectRoleSchema }));

// Types
export type User = z.infer<typeof userSchema>;
