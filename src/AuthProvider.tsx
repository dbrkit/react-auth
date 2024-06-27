import React, {
  PropsWithChildren,
  useEffect,
  useState,
  createContext,
} from "react";

import { AuthApi, Status, IUser } from "types";

type AuthProviderInterface<User, Role> = {
  error?: string;
  isAuth?: boolean;
  setStatus: (status: Status) => void;
  user: IUser<User, Role>;
  refresh: () => void;
  status: Status;
};

export type AuthInterface<T, User, Role> = Partial<
  AuthProviderInterface<User, Role>
> &
  T;

export const AuthContext = createContext<
  AuthInterface<unknown, unknown, unknown>
>({});

// @todo use react-query
export default function AuthProvider<
  T extends AuthApi<User, Role>,
  User,
  Role = string
>({
  children,
  auth: { login, logout, getUser, ...auth },
}: PropsWithChildren<{
  auth: T extends AuthApi<User, Role> ? AuthApi<User, Role> : T;
}>) {
  const [status, setStatus] = useState<Status>(Status.INITIAL);
  const [user, setUser] = useState<IUser<User, Role>>();
  const [error, setError] = useState<string>();

  const isAuth = status == Status.AUTHENTICATED;

  const handleLogin = (...params) =>
    login(...params).then(({ ...user }) => {
      setStatus(Status.AUTHENTICATED);
      setUser({
        ...user,
      });
      return { ...user };
    });

  const handleLogout = () =>
    logout()
      .catch((e) => console.debug(e))
      .finally(() => {
        setStatus(Status.ANONYMOUS);
        setUser(undefined);
      });

  const fetchUser = () => {
    setStatus(Status.LOADING);
    getUser()
      .then((v) => {
        setUser(v);
        setStatus(Status.AUTHENTICATED);
      })
      .catch((e) => {
        console.debug("Failed to retrieve user data", e);
        // If an error happen, set the auth flag to false since we cannot be sure whether the user
        // is authenticated or not.
        setStatus(Status.FAILED);
        if (e?.statusCode !== 401) {
          setError(e.message);
        }
      });
  };

  useEffect(() => {
    if (isAuth || (user && user.id)) {
      return;
    }
    fetchUser();
  }, [isAuth, user]);

  return (
    <AuthContext.Provider
      value={{
        error,
        isAuth,
        user,
        status,
        login: handleLogin,
        logout: handleLogout,
        refresh: fetchUser,
        setStatus,
        ...auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
