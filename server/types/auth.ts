export enum Role {
  Admin = 1,
  User = 2,
}

export type Auth = ReturnType<typeof generateAuthHandler>;
