"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Brand } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROLE_HOME, ROLE_LABEL, type UserRole } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const roleParam = (params.get("role") as UserRole | null) ?? undefined;
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = login(email, password, roleParam === "admin" ? "admin" : roleParam);
    if (!result.ok) {
      setError(result.error ?? "Connexion impossible.");
      return;
    }
    const role = result.role!;
    router.push(ROLE_HOME[role]);
  };

  return (
    <Card padding="lg" className="w-full max-w-md" active>
      <Brand size="sm" className="mb-4" />
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-coral">Connexion</p>
      <h1 className="mt-2 font-display text-3xl">
        {roleParam ? ROLE_LABEL[roleParam] : "Bienvenue"}
      </h1>
      <p className="mt-2 mb-6 text-sm font-light text-muted">
        {roleParam === "admin"
          ? "Compte démo : admin@startupy.tn / admin123"
          : roleParam === "investor"
            ? "Démo : investor@startupy.tn / demo123"
            : roleParam === "entrepreneur"
              ? "Démo : founder@startupy.tn / demo123"
              : "Connectez-vous à votre espace Startupy."}
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-brown-mid">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-sand bg-surface px-4 py-3 outline-none focus:border-coral focus:shadow-[0_0_0_3px_var(--color-coral-soft)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-brown-mid">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-sand bg-surface px-4 py-3 outline-none focus:border-coral focus:shadow-[0_0_0_3px_var(--color-coral-soft)]"
          />
        </div>
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" variant="accent" className="w-full">
          Se connecter
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link
          href={roleParam && roleParam !== "admin" ? `/register?role=${roleParam}` : "/auth"}
          className="font-medium text-coral hover:underline"
        >
          S&apos;inscrire
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-muted-light">
        <Link href="/auth" className="hover:underline">
          Changer de profil
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="atmosphere-subtle flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-16">
      <Suspense fallback={<p className="text-muted">Chargement…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
