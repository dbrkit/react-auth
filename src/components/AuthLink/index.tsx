import React from "react";
import { Link } from "@dbrkit/react-router";

import { Role } from "../../types";
import CheckPermissions, { PermissionProps } from "../CheckPermissions";

interface AuthLinkPropsType extends Partial<PermissionProps<Role<string>>> {}

export default function AuthLink({
  superAdmin,
  roles,
  auth,
  accessDeniedComponent,
  ...props
}: AuthLinkPropsType) {
  return (
    <CheckPermissions
      auth={auth || true}
      roles={roles}
      superAdmin={superAdmin || false}
      accessDeniedComponent={accessDeniedComponent || (() => null)}
    >
      <Link {...props} />
    </CheckPermissions>
  );
}
