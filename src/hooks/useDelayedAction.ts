import { useEffect, useRef } from "react";

function useDelayedAction(action: () => void, delay: number, dependency: any) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      action();
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dependency]);
}

export default useDelayedAction;
