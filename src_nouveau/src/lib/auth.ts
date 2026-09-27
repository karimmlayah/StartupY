export type UserRole = "entrepreneur" | "investor" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  /** Demo only — never store plaintext passwords in production */
  password: string;
  createdAt: string;
}

export const ROLE_HOME: Record<UserRole, string> = {
  entrepreneur: "/dashboard",
  investor: "/investisseurs",
  admin: "/admin",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  entrepreneur: "Entrepreneur",
  investor: "Investisseur",
  admin: "Administrateur",
};

export const SEED_USERS: AuthUser[] = [
  {
    id: "admin-1",
    email: "admin@startupy.tn",
    name: "Admin Startupy",
    role: "admin",
    password: "admin123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-founder",
    email: "founder@startupy.tn",
    name: "Amira Fondatrice",
    role: "entrepreneur",
    password: "demo123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-investor",
    email: "investor@startupy.tn",
    name: "Karim Investisseur",
    role: "investor",
    password: "demo123",
    createdAt: new Date().toISOString(),
  },
];
