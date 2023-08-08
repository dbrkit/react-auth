import { Role, Status } from "../types";
import useAuth from "../hooks/useAuth";

export default function useSession<R = string>() {
  const { user, status, isAuth, lastActivity, ...rest } = useAuth();

  const hasRole = (role: Role<R>) => {
    return user?.roles
      ? user.roles.includes(role)
      : user?.role
      ? user.role === role
      : false;
  };

  const isAdmin = hasRole("administrator");
  const isLoading = status === Status.LOADING || status === Status.INITIAL;

  return {
    user,
    status,
    isAuth,
    isAdmin,
    hasRole,
    isLoading,
    ...rest,
  };
}
