export interface UserSignup {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
