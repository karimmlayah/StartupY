"use client";

import Link from "next/link";
import { Brand } from "@/components/ui/Brand";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const roles = [
  {
    id: "entrepreneur" as const,
    title: "Entrepreneur",
    text: "Diagnostic, roadmap gamifiée, chatbot juridique et préparation au financement.",
    href: "/register?role=entrepreneur",
    loginHref: "/login?role=entrepreneur",
    accent: "coral",
  },
  {
    id: "investor" as const,
    title: "Investisseur",
    text: "Parcourez les startups sélectionnées, filtrez et demandez des réunions.",
    href: "/register?role=investor",
    loginHref: "/login?role=investor",
    accent: "bronze",
  },
];

export default function AuthChoosePage() {
  return (
    <div className="atmosphere-subtle flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <Brand size="lg" className="mb-4 inline-block" />
          <h1 className="mt-2 font-display text-3xl text-ink md:text-4xl">
            Qui êtes-vous ?
          </h1>
          <p className="mx-auto mt-3 max-w-md font-light text-muted">
            Choisissez votre profil, puis créez un compte ou connectez-vous.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {roles.map((r) => (
            <Card
              key={r.id}
              padding="lg"
              className={cn(
                "flex flex-col",
                r.accent === "coral" && "hover:shadow-[0_0_0_1px_var(--color-coral-border)]"
              )}
            >
              <p
                className={cn(
                  "text-xs font-medium uppercase tracking-[0.14em]",
                  r.accent === "coral" ? "text-coral" : "text-bronze"
                )}
              >
                Espace {r.title.toLowerCase()}
              </p>
              <h2 className="mt-3 font-display text-2xl">{r.title}</h2>
              <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-muted">
                {r.text}
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href={r.href}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition",
                    r.accent === "coral"
                      ? "bg-coral text-white hover:bg-coral-dark"
                      : "bg-ink text-cream hover:bg-brown-mid"
                  )}
                >
                  Créer un compte
                </Link>
                <Link
                  href={r.loginHref}
                  className="inline-flex items-center justify-center rounded-md border border-sand px-5 py-3 text-sm text-brown-mid transition hover:border-bronze-border"
                >
                  Se connecter
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-light">
          Administrateur ?{" "}
          <Link href="/login?role=admin" className="text-bronze underline-offset-2 hover:underline">
            Accès admin
          </Link>
        </p>
      </div>
    </div>
  );
}
