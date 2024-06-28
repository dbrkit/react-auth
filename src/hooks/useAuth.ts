import { useContext } from "react";

import { AuthContext, AuthInterface } from "../AuthProvider";
import { AuthApi } from "../types";

export default function useAuth<T extends AuthApi<U, R>, U, R>() {
  // @ts-expect-error: Ambiguous user generic
  return useContext<AuthInterface<T, U, R>>(AuthContext);
}
