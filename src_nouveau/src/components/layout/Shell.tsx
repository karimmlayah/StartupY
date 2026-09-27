"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();

  const links =
    user?.role === "investor"
      ? [{ href: "/investisseurs", label: "Dealflow" }]
      : user?.role === "admin"
        ? [
            { href: "/admin", label: "Admin" },
            { href: "/investisseurs", label: "Dealflow" },
            { href: "/dashboard", label: "Parcours" },
          ]
        : user?.role === "entrepreneur"
          ? [
              { href: "/dashboard", label: "Parcours" },
              { href: "/diagnostic", label: "Diagnostic" },
            ]
          : [
              { href: "/dashboard", label: "Parcours" },
              { href: "/investisseurs", label: "Investisseurs" },
            ];

  const onLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-sand/60 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Startupy — Accueil">
          <span
            className="size-7 rounded-md bg-gradient-to-br from-coral via-coral-dark to-brown shadow-[inset_0_1px_0_rgb(255_255_255_/_0.25)]"
            aria-hidden
          />
          <Brand size="md" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-sm px-3.5 py-2 text-sm text-muted transition-colors hover:bg-coral-soft hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {hydrated && user ? (
            <>
              <span className="hidden text-xs text-muted sm:inline">
                {user.name} · {ROLE_LABEL[user.role]}
              </span>
              <Link href={ROLE_HOME[user.role]}>
                <Button size="sm" variant="outline">
                  Mon espace
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={onLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button size="sm" variant="outline">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" variant="accent">
                  Commencer
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink px-6 pb-8 pt-16 text-sand">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_1fr]">
        <div className="max-w-xs">
          <Brand size="lg" inverted className="mb-3" />
          <p className="mt-3 text-sm font-light leading-relaxed text-sand/80">
            De l&apos;idée au financement — conçu pour les entrepreneurs tunisiens.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h4 className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-coral">
              Produit
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/diagnostic" className="hover:text-cream">
                Diagnostic
              </Link>
              <Link href="/dashboard" className="hover:text-cream">
                Parcours
              </Link>
              <Link href="/investisseurs" className="hover:text-cream">
                Investisseurs
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-coral">
              Compte
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/auth" className="hover:text-cream">
                Connexion / Inscription
              </Link>
              <Link href="/login?role=admin" className="hover:text-cream">
                Admin
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-full flex flex-wrap justify-between gap-3 border-t border-sand/20 pt-8 text-sm text-taupe">
          <span>
            © {new Date().getFullYear()} Startup<span className="text-coral">y</span> · Tunisie
          </span>
          <span className="tracking-wide text-coral">Accompagnement intelligent</span>
        </div>
      </div>
    </footer>
  );
}
