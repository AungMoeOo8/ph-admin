import { useEffect, useRef } from "react";

function useDelayedAction(action: () => void, dependency: any) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      action();
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dependency]);
}

export default useDelayedAction;
