"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Brand } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROLE_HOME, ROLE_LABEL, type UserRole } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/cn";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const roleParam = params.get("role");
  const initialRole: Exclude<UserRole, "admin"> =
    roleParam === "investor" ? "investor" : "entrepreneur";

  const register = useAuthStore((s) => s.register);

  const [role, setRole] = useState<Exclude<UserRole, "admin">>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = register({ name, email, password, role });
    if (!result.ok) {
      setError(result.error ?? "Inscription impossible.");
      return;
    }
    router.push(ROLE_HOME[role]);
  };

  return (
    <Card padding="lg" className="w-full max-w-md" active>
      <Brand size="sm" className="mb-4" />
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-coral">Inscription</p>
      <h1 className="mt-2 font-display text-3xl">Créer un compte</h1>
      <p className="mt-2 mb-6 text-sm font-light text-muted">
        Confirmez votre profil puis renseignez vos identifiants.
      </p>

      <div className="mb-5 grid grid-cols-2 gap-2" role="group" aria-label="Profil">
        {(["entrepreneur", "investor"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "rounded-md border px-3 py-3 text-sm transition",
              role === r
                ? "border-coral bg-coral-soft text-ink"
                : "border-sand text-muted hover:border-coral-border"
            )}
          >
            {ROLE_LABEL[r]}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-brown-mid">
            Nom complet
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-sand bg-surface px-4 py-3 outline-none focus:border-coral focus:shadow-[0_0_0_3px_var(--color-coral-soft)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-brown-mid">
            E-mail
          </label>
          <input
            id="email"
            type="email"
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
            required
            minLength={6}
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
          Créer mon compte {ROLE_LABEL[role].toLowerCase()}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href={`/login?role=${role}`} className="font-medium text-coral hover:underline">
          Se connecter
        </Link>
      </p>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="atmosphere-subtle flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-16">
      <Suspense fallback={<p className="text-muted">Chargement…</p>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
