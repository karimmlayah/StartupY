"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Badge } from "@/components/ui/Badge";
import { Brand } from "@/components/ui/Brand";
import { Card } from "@/components/ui/Card";
import { ROLE_LABEL } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

export default function AdminPage() {
  const users = useAuthStore((s) => s.users);
  const current = useAuthStore((s) => s.user);

  return (
    <AuthGuard roles={["admin"]}>
      <div className="atmosphere px-6 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <Brand size="sm" className="mb-4" />
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-coral">
            Administration
          </p>
          <h1 className="mt-3 mb-2 font-display text-4xl">Tableau de bord</h1>
          <p className="mb-10 font-light text-muted">
            Bienvenue {current?.name}. Vue d&apos;ensemble des comptes inscrits (démo locale).
          </p>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card padding="md">
              <p className="text-xs uppercase tracking-wide text-taupe">Total</p>
              <p className="mt-2 font-display text-3xl text-ink">{users.length}</p>
            </Card>
            <Card padding="md">
              <p className="text-xs uppercase tracking-wide text-taupe">Entrepreneurs</p>
              <p className="mt-2 font-display text-3xl text-coral">
                {users.filter((u) => u.role === "entrepreneur").length}
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs uppercase tracking-wide text-taupe">Investisseurs</p>
              <p className="mt-2 font-display text-3xl text-bronze">
                {users.filter((u) => u.role === "investor").length}
              </p>
            </Card>
          </div>

          <Card padding="lg">
            <h2 className="mb-4 font-display text-xl">Utilisateurs</h2>
            <ul className="divide-y divide-sand">
              {users.map((u) => (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-ink">{u.name}</p>
                    <p className="text-sm text-muted">{u.email}</p>
                  </div>
                  <Badge variant={u.role === "entrepreneur" ? "bronze" : "stage"}>
                    {ROLE_LABEL[u.role]}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
