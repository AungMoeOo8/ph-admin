import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isValid = location.pathname.includes("/dashboard", 0);

    if (!isValid) {
      navigate("/dashboard", { replace: true });
    }
  }, [location]);

  return <Outlet />;
}
