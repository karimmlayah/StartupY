"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SEED_USERS,
  type AuthUser,
  type UserRole,
} from "@/lib/auth";

interface AuthState {
  user: Omit<AuthUser, "password"> | null;
  users: AuthUser[];
  hydrated: boolean;

  setHydrated: (v: boolean) => void;
  register: (input: {
    name: string;
    email: string;
    password: string;
    role: Exclude<UserRole, "admin">;
  }) => { ok: boolean; error?: string };
  login: (email: string, password: string, expectedRole?: UserRole) => {
    ok: boolean;
    error?: string;
    role?: UserRole;
  };
  logout: () => void;
}

function publicUser(u: AuthUser): Omit<AuthUser, "password"> {
  const { password: _, ...rest } = u;
  return rest;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: SEED_USERS,
      hydrated: false,

      setHydrated: (v) => set({ hydrated: v }),

      register: ({ name, email, password, role }) => {
        const normalized = email.trim().toLowerCase();
        if (!name.trim() || !normalized || password.length < 6) {
          return {
            ok: false,
            error: "Nom, e-mail et mot de passe (6+ caractères) requis.",
          };
        }
        if (get().users.some((u) => u.email === normalized)) {
          return { ok: false, error: "Un compte existe déjà avec cet e-mail." };
        }
        const user: AuthUser = {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: normalized,
          password,
          role,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          users: [...s.users, user],
          user: publicUser(user),
        }));
        return { ok: true };
      },

      login: (email, password, expectedRole) => {
        const normalized = email.trim().toLowerCase();
        const found = get().users.find(
          (u) => u.email === normalized && u.password === password
        );
        if (!found) {
          return { ok: false, error: "E-mail ou mot de passe incorrect." };
        }
        if (expectedRole && found.role !== expectedRole && found.role !== "admin") {
          return {
            ok: false,
            error: `Ce compte n'est pas un compte ${expectedRole === "investor" ? "investisseur" : "entrepreneur"}.`,
          };
        }
        // Admin can always log in via admin path; if expectedRole is admin, require admin
        if (expectedRole === "admin" && found.role !== "admin") {
          return { ok: false, error: "Accès administrateur requis." };
        }
        set({ user: publicUser(found) });
        return { ok: true, role: found.role };
      },

      logout: () => set({ user: null }),
    }),
    {
      name: "startupy-auth",
      partialize: (s) => ({ user: s.user, users: s.users }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
