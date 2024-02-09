/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import AuthProvider from "../src/AuthProvider";
import useSession from "../src/hooks/useSession";

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

export default function Test() {
  return (
    <AuthProvider auth={auth}>
      <UserProfile />
    </AuthProvider>
  );
}
