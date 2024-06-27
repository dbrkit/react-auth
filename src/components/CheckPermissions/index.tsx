import React, { PropsWithChildren } from "react";

import useSession from "hooks/useSession";

export interface PermissionProps<Role> extends PropsWithChildren {
  roles?: Role[];
  auth: boolean;
  superAdmin: boolean;
  accessDeniedComponent: React.ElementType;
}

/**
 * A component that give access to children/component if criteria are met.
 */
function CheckPermissions({
  roles,
  auth = true,
  accessDeniedComponent: AccessDeniedComponent = () => (
    <React.Fragment>Access Denied</React.Fragment>
  ),
  children,
  superAdmin,
}: PermissionProps<string>) {
  const { hasRole, isAdmin, isAuth } = useSession();
  const rolesCheck = roles ? roles.some((role) => hasRole(role)) : true;

  const isAllowed =
    (isAdmin && superAdmin) || // The user is an admin
    ((!auth || isAuth) && // The authentication is not needed or needed and user is auth
      !!rolesCheck); // no roles or role met

  return <>{isAllowed ? children : <AccessDeniedComponent /> ?? null}</>;
}

export default CheckPermissions;
