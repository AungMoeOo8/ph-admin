import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStateChange } from "./hooks/useAuthStateChange";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuthStateChange();

  useEffect(() => {
    console.log(location.pathname);

    if (auth.session) {
      if (location.pathname == "/login") {
        navigate("/dashboard", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [auth]);

  return <Outlet />;
}
