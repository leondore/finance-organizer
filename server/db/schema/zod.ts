import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { profiles, roles, users, countries } from '.';

const selectUserSchema = createSelectSchema(users, {
  id: (schema) => schema.id.optional(),
}).omit({
  password: true,
  roleId: true,
});

const selectRoleSchema = createSelectSchema(roles);

const selectProfileSchema = createSelectSchema(profiles, {
  phone: (schema) => schema.phone.optional(),
  avatarId: (schema) => schema.avatarId.optional(),
}).pick({
  firstName: true,
  lastName: true,
  phone: true,
  avatarId: true,
});

export const selectCountrySchema = createSelectSchema(countries).omit({
  id: true,
});

export const userSchema = selectUserSchema.merge(
  z.object({
    role: selectRoleSchema,
    profile: selectProfileSchema,
    country: selectCountrySchema.nullable(),
  })
);
