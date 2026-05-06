import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Role, User } from "@/types";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  login: (nextUser: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const toRole = (candidate: unknown): Role => {
      return candidate === "super_admin" || candidate === "company_admin" || candidate === "hr" || candidate === "employee"
        ? candidate
        : "employee";
    };

    const syncFromSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;
      if (!sessionUser) {
        setUser(null);
        return;
      }

      setUser({
        id: sessionUser.id,
        name: (sessionUser.user_metadata?.full_name as string) || sessionUser.email?.split("@")[0] || "User",
        email: sessionUser.email || "",
        role: toRole(sessionUser.user_metadata?.role),
      });
    };

    void syncFromSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      if (!sessionUser) {
        setUser(null);
        return;
      }

      setUser({
        id: sessionUser.id,
        name: (sessionUser.user_metadata?.full_name as string) || sessionUser.email?.split("@")[0] || "User",
        email: sessionUser.email || "",
        role: toRole(sessionUser.user_metadata?.role),
      });
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = (nextUser: User) => setUser(nextUser);
  const logout = () => {
    void supabase.auth.signOut();
    setUser(null);
  };

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
