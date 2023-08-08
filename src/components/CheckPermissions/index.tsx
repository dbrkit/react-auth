import { Component, PropsWithChildren } from "react";
import useSession from "../../hooks/useSession";

export interface PermissionProps<Role> extends PropsWithChildren {
  roles?: Role[];
  auth: boolean;
  superAdmin: boolean;
  accessDeniedComponent: any;
}

/**
 * A component that give access to children/component if criteria are met.
 */
const CheckPermissions: (props: PermissionProps<any>) => any = ({
  roles,
  auth = true,
  accessDeniedComponent: AccessDeniedComponent = () => <>Access Denied</>,
  children,
  superAdmin,
}) => {
  const { hasRole, isAdmin, isAuth } = useSession();
  const rolesCheck = roles ? roles.some((role) => hasRole(role)) : true;

  const isAllowed =
    (isAdmin && superAdmin) || // The user is an admin
    ((!auth || isAuth) && // The authentication is not needed or needed and user is auth
      !!rolesCheck); // no roles or role met

  if (isAllowed) return children ?? null;
  return <AccessDeniedComponent /> ?? null;
};

export default CheckPermissions;
