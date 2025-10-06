import { User, login as LoginRequest, logout as logoutRequest } from "@/features/wordpress/auth.service";
import { fetchFactory } from "@/fetchFactory";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router";

export type AuthContextProps = {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
} | null;

const AuthContext = createContext<AuthContextProps>(null);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate()

  const isAuthenticated = useMemo(() => user !== null, [user]);

  async function logout() {
    try {
      await logoutRequest();
      setUser(null);
      fetchFactory.clearToken()
      await navigate("/login", { replace: true });
    } catch {
      throw new Error("Logout failed")
    }
  }

  async function login(username: string, password: string) {
    try {
      const user = await LoginRequest(username, password);
      setUser(user);
      fetchFactory.setToken({ accessToken: user.accessToken, accessExpiry: user.accessExpiry })
      const to = new URL(location.href).searchParams.get("from") || "/dashboard/people"
      await navigate(to, { replace: true });
    } catch {
      throw new Error("Login failed")
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const authCtx = useContext(AuthContext);

  if (!authCtx) {
    throw new Error("This hook must be used under AuthProvider");
  }

  return authCtx;
}
