import React, {
  FC,
  Fragment,
  PropsWithChildren,
  ReactElement,
  Suspense,
  useMemo,
} from "react";
import { Navigate } from "@dbrkit/react-router";

import CheckPermissions from "../CheckPermissions";
import useSession from "../../hooks/useSession";
import { Role } from "../../types";

export interface AuthRouteProps<Role> extends PropsWithChildren {
  loadingFallback?: React.ElementType;
  suspenseFallback?: React.ReactNode;
  redirectRoute?: string;
  InvalidUserRoleFallback?: React.ElementType;
  isPrivate?: boolean;
  shouldRedirect?: boolean;
  roles?: Role[];
  superAdmin?: boolean;
}

const ComponentLoader = ({
  loading,
  children,
}: PropsWithChildren<{ loading: boolean }>) => {
  return <Fragment>{!loading ? children : null}</Fragment>;
};

const AuthRoute: FC<AuthRouteProps<Role<string>>> = ({
  children,
  roles,
  shouldRedirect = true,
  loadingFallback,
  suspenseFallback,
  redirectRoute,
  InvalidUserRoleFallback,
  isPrivate,
  superAdmin = true,
}): ReactElement => {
  const { isAuth, isLoading } = useSession();

  const isPrivateRoute = useMemo(
    () =>
      !!(
        (
          isPrivate === undefined || // A route is always a protected route if not specified
          isPrivate || // If a route is protected
          roles
        ) // If a route requires roles // If a route supply custom access function
      ),
    [isPrivate, roles]
  );

  const redirectTo: string = redirectRoute || "/";
  const SuspenseFallbackComponent = suspenseFallback || null;
  const LoaderComponent = loadingFallback || ComponentLoader;

  if (isPrivateRoute && !isAuth && !isLoading && shouldRedirect)
    return <Navigate to={redirectTo} />;

  return (
    <LoaderComponent loading={isLoading}>
      <Suspense fallback={SuspenseFallbackComponent}>
        <CheckPermissions
          superAdmin={superAdmin}
          roles={roles}
          auth={isPrivateRoute}
          accessDeniedComponent={InvalidUserRoleFallback}
        >
          {children}
        </CheckPermissions>
      </Suspense>
    </LoaderComponent>
  );
};

export default AuthRoute;
