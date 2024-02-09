export enum Status {
  AUTHENTICATED = "authenticated",
  ANONYMOUS = "anonymous",
  FAILED = "failed",
  LOADING = "loading",
  INITIAL = "initial",
}

export type Role<T> = string | T;

export type IUser<User, R> = User & {
  id: number | string;
  roles?: Role<R>[];
  role?: Role<R>;
};

export type AuthApi<User, Role> = {
  login: (...params) => Promise<IUser<User, Role>>;
  logout: () => Promise<unknown>;
  getUser: () => Promise<IUser<User, Role>>;
  lastActivity?: () => Promise<unknown>;
  checkResetPasswordToken?: (token: string) => Promise<unknown>;
  resetPassword?: (...params) => Promise<unknown>;
  forgotPassword?: (...params) => Promise<unknown>;
};
