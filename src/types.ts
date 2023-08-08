export enum Status {
  AUTHENTICATED = "authenticated",
  ANONYMOUS = "anonymous",
  FAILED = "failed",
  LOADING = "loading",
  INITIAL = "initial",
}

export interface AuthApi {
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  getUser: () => Promise<any>;
  lastActivity?: () => Promise<any>;
  checkResetPasswordToken?: (token: any) => Promise<any>;
  resetPassword?: (values: any) => Promise<any>;
  forgotPassword?: (values: any) => Promise<any>;
}

export type Role<T> = string | T;

export type IUser<User, R> = User & { id: number | string; roles?: Role<R>[] };
