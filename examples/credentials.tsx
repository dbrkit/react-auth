/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { PropsWithChildren } from "react";

// import AuthProvider from "../src/AuthProvider";
// import useSession from "../src/hooks/useSession";
// import AuthRoute from "../src/components/AuthRoute";
import { AuthProvider, useSession, AuthRoute, AuthLink } from "../dist";

type Role = "admin" | "supervisor";
type User = {
  id: number;
  name: string;
  email: string;
};

type Api = {
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<string>;
  getUser: () => Promise<User>;
  user: User;
};

const UserProfile = () => {
  const { user, login, logout, getUser } = useSession<Api, User, Role>();
  user?.role;
  return <h1>Hi {user?.name}</h1>;
};

const mockUser = {
  id: 1,
};

const auth = {
  login: async (name: string, password: string) => Promise.resolve(mockUser),
  logout: async () => Promise.resolve(),
  getUser: async () => Promise.resolve(mockUser),
};

function Provider({ children }: PropsWithChildren) {
  return <AuthProvider auth={auth}>{children}</AuthProvider>;
}

const PrivateRoute = () => (
  <Provider>
    <AuthRoute isPrivate shouldRedirect={false} isAdmin>
      <>Hello World</>
      <UserProfile />
    </AuthRoute>
  </Provider>
);

const Link = () => <AuthLink roles={["supervisor"]}>Authorized link</AuthLink>;
