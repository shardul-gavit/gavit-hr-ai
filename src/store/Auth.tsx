import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Role, User } from "@/types";

interface AuthState {
  user: User | null;
  login: (role: Role) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const DEMO_USERS: Record<Role, User> = {
  super_admin: {
    id: "u-sa", name: "Aditya Gavit", email: "admin@gavit.in", role: "super_admin",
    designation: "Platform Owner", department: "Gavit E-Services",
  },
  company_admin: {
    id: "u-ca", name: "Rajesh Kumar", email: "rajesh@tatainnovations.in", role: "company_admin",
    companyId: "c1", companyName: "Tata Innovations Pvt Ltd", designation: "CEO", department: "Leadership",
  },
  hr: {
    id: "u-hr", name: "Priya Mehta", email: "priya.hr@tatainnovations.in", role: "hr",
    companyId: "c1", companyName: "Tata Innovations Pvt Ltd", designation: "HR Manager", department: "HR",
  },
  employee: {
    id: "demo-emp", name: "Ananya Sharma", email: "ananya@tatainnovations.in", role: "employee",
    companyId: "c1", companyName: "Tata Innovations Pvt Ltd", designation: "Senior Software Engineer", department: "Engineering",
  },
};

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

  const login = (role: Role) => {
    const u = DEMO_USERS[role];
    setUser(u);
    return u;
  };
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
