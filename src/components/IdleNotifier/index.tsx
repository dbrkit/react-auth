import { useEffect } from "react";
import { useIdle, usePrevious } from "@mantine/hooks";

import useAuth from "hooks/useAuth";
import { AuthApi } from "../../types";

const IDLE_TIMER = 3e5;

function IdleNotifier<User, Role>() {
  const { isAuth, lastActivity } = useAuth<AuthApi<User, Role>, User, Role>();
  const isIdle = useIdle(IDLE_TIMER, {
    initialState: false,
  });
  const previousValue = usePrevious(isIdle);

  useEffect(() => {
    if (!isAuth) return;

    if (!previousValue && isIdle) {
      // User is idle and authenticated, call the callback
      lastActivity && lastActivity();
    }
  }, [isIdle, isAuth, previousValue]);

  return null;
}

export default IdleNotifier;
