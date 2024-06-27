import { AuthApi, Role, Status } from "types";
import useAuth from "hooks/useAuth";

function useSession<T extends AuthApi<User, R>, User, R>() {
  const { user, status, ...rest } = useAuth<T, User, R>();

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
    isAdmin,
    hasRole,
    isLoading,
    ...rest,
  };
}

export default useSession;
