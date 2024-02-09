import React, { ReactElement, ReactNode } from "react";
import { Navigate } from "@dbrkit/react-router";

import AuthRoute, { AuthRouteProps } from "./components/AuthRoute";
import { Role } from "./types";

export default function withAuth<P extends object, R extends string>(
  WrappedComponent: React.ComponentType<unknown> & {
    getLayout?: (page: ReactElement) => ReactNode;
  },
  authProps: AuthRouteProps<Role<R>> = {
    InvalidUserRoleFallback: () => <Navigate to="/user/login" />,
    isPrivate: true,
    shouldRedirect: true,
  }
) {
  return function WithAuth(props: P) {
    const getLayout = WrappedComponent.getLayout ?? ((page) => page);
    const layout = getLayout(<WrappedComponent {...props} />);
    return <AuthRoute {...authProps}>{layout}</AuthRoute>;
  };
}
