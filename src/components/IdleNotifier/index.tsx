import { useEffect } from "react";
import { useIdle, usePrevious } from "@mantine/hooks";

import useAuth from "../../hooks/useAuth";

const IDLE_TIMER = 3e5;

const IdleNotifier = () => {
  const { isAuth, lastActivity } = useAuth();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIdle, isAuth, previousValue]);

  return null;
};

export default IdleNotifier;
