import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// Models
export const roles = pgTable(
  'roles',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    role: varchar('role', { length: 32 }).notNull().unique(),
  },
  (table) => {
    return {
      roleIdx: uniqueIndex('role_idx').on(table.role),
    };
  }
);

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    email: varchar('email', { length: 256 }).notNull(),
    password: text('password').notNull(),
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id),
    firstName: varchar('first_name', { length: 64 }).notNull(),
    lastName: varchar('last_name', { length: 64 }),
    avatarId: uuid('avatar_id'),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
      firstNameLastNameIdx: index('first_name_last_name_idx').on(
        table.firstName,
        table.lastName
      ),
    };
  }
);

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});
