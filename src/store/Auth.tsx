import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Role, User } from "@/types";

interface AuthState {
  user: User | null;
  login: (nextUser: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("gavit-hr-user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem("gavit-hr-user", JSON.stringify(user));
    else localStorage.removeItem("gavit-hr-user");
  }, [user]);

  const login = (nextUser: User) => setUser(nextUser);
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const ROLE_HOME: Record<Role, string> = {
  super_admin: "/admin",
  company_admin: "/company",
  hr: "/hr",
  employee: "/me",
};

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  company_admin: "Company Admin",
  hr: "HR Manager",
  employee: "Employee",
};
