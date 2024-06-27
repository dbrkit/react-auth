# React Auth by dbrkit

## Introduction

This library provides authentication functionality for React applications. It includes hooks, components, and higher-order components for managing user authentication, roles, and protected routes.

## Installation

You can install the library via npm or yarn:

```bash
npm install @dbrkit/react-auth
```

or

```bash
yarn add @dbrkit/react-auth
```

## Usage

### Components, Hooks, and HOC

The library provides the following components, hooks, and higher-order component:

- `AuthProvider`: A provider component for managing authentication state.
- `AuthRoute`: A route component for protecting routes based on authentication and roles.
- `AuthLink`: A link component for conditionally rendering links based on user roles.
- `useSession`: A hook for accessing authentication information in components.
- `withAuth`: A higher-order component for wrapping components with authentication logic.

### Example Usage

```javascript
import React, { PropsWithChildren } from "react";
import { AuthProvider, useSession, AuthRoute, AuthLink, withAuth } from "@dbrkit/react-auth";

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

// Example of using withAuth HOC
const AdminPage = () => <h1>Welcome Admin!</h1>;

export default withAuth(AdminPage, { roles: ['admin'] });
```

## Integration with Next.js

To integrate the library with a Next.js application, follow these steps:

1. Install the library as described above.

2. Use the `AuthProvider` in your Next.js `_app.js` or `Layout` component.

Example (\_app.js for Next.js version < 13):

```javascript
// _app.js

import { AuthProvider } from "@dbrkit/react-auth";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider auth={yourAuthObject}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
```

Example (Layout component for Next.js version > 13):

```javascript
// layout.js

import { AuthProvider } from "@dbrkit/react-auth";

const Layout = ({ children }) => {
  return <AuthProvider auth={yourAuthObject}>{children}</AuthProvider>;
};

export default Layout;
```

3. Wrap the routes that require authentication with the `AuthRoute` component.

```javascript
// pages/test/index.js
// app/test/page.js

import { AuthRoute } from "@dbrkit/react-auth";

const ProtectedPage = () => (
  <AuthRoute isPrivate shouldRedirect={false} isAdmin>
    <h1>This is a protected page</h1>
  </AuthRoute>
);

export default ProtectedPage;
```
