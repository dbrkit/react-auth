import { PropsWithChildren, useEffect, useState, createContext } from "react";
import { AuthApi, Status, IUser } from "./types";

export interface AuthProviderInterface extends Omit<AuthApi, "getUser"> {
  error?: any;
  isAuth?: boolean;
  user: any;
  setStatus: any;
  refresh: any;
  status: Status;
}

export const AuthContext = createContext<
  AuthProviderInterface | Partial<AuthProviderInterface>
>({});

// @todo use react-query
export default function AuthProvider<User, Role = string>({
  children,
  auth: {
    login,
    logout,
    getUser,
    lastActivity,
    checkResetPasswordToken,
    resetPassword,
    forgotPassword,
  },
}: PropsWithChildren<{ auth: AuthApi }>) {
  const [status, setStatus] = useState<Status>(Status.INITIAL);
  const [user, setUser] = useState<IUser<User, Role>>();
  const [error, setError] = useState<any>();

  const isAuth = status == Status.AUTHENTICATED;

  const handleLogin = (email: string, password: string) =>
    login(email, password).then(({ id, ...user }) => {
      setStatus(Status.AUTHENTICATED);
      setUser({
        ...user,
        id,
      });
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
        if (e.statusCode !== 401) {
          setError(e.message);
        }
      });
  };

  useEffect(() => {
    if (isAuth || (user && user.id)) {
      return;
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        lastActivity,
        checkResetPasswordToken,
        resetPassword,
        forgotPassword,
        setStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
