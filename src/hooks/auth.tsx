import { getUserFromStorage, setUserToStorage } from "@/util";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type User = {
  id: number;
  email: string;
  name: string;
  token: string;
};

export type AuthContextProps = {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  login: (user: User) => void;
} | null;

const AuthContext = createContext<AuthContextProps>(null);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  function logout() {
    setUser(null);
    sessionStorage.removeItem("user");
  }

  function login(user: User) {
    setUser(user);
    setUserToStorage(user);
  }

  useEffect(() => {
    const persistedUser = getUserFromStorage();

    if (!persistedUser) return;

    setUser(persistedUser);
  }, []);

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
