import { useEffect } from "react";
import { Outlet } from "react-router";
import { useAuth } from "./hooks/auth";

export default function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate("/login", { replace: true, flushSync: false });
    //   return;
    // }
    // if (location.pathname === "/login") {
    //   navigate("/dashboard/people", { replace: true });
    // }
  }, [isAuthenticated]);

  return <Outlet />;
}
