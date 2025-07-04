import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./hooks/auth";

export default function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true, flushSync: false });
      return;
    }
    if (location.pathname === "/login") {
      navigate("/dashboard/people", { replace: true });
    }
  }, [isAuthenticated]);

  return <Outlet />;
}
