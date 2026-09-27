import Link from "next/link";
import { Brand } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";

const pillars = [
  {
    num: "01",
    title: "Roadmap gamifiée",
    text: "Un parcours clair de l'idée au financement, avec étapes, badges et score de maturité.",
  },
  {
    num: "02",
    title: "Chatbot juridique",
    text: "Assistant flottant toujours accessible — réponses sourcées sur le droit des affaires tunisien.",
  },
  {
    num: "03",
    title: "Investisseurs vérifiés",
    text: "Un espace sélectif pour présenter votre dossier à des business angels et fonds locaux.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative flex min-h-[calc(100vh-72px)] items-end overflow-hidden pb-24 pt-16 md:items-end">
        <div
          className="absolute inset-0 bg-[linear-gradient(165deg,rgba(42,33,26,0.55)_0%,rgba(61,47,34,0.35)_40%,rgba(92,69,48,0.25)_70%,rgba(245,239,230,0.15)_100%),linear-gradient(145deg,#3d2f22_0%,#5c4530_35%,#8b7d6b_65%,#c9a876_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent"
          aria-hidden
        />
        {/* coral accent glow */}
        <div
          className="pointer-events-none absolute -right-20 top-20 size-72 rounded-full bg-coral/20 blur-3xl"
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <Brand size="hero" inverted className="mb-5 drop-shadow-sm" />
          <h1 className="mb-5 font-display text-2xl font-normal tracking-tight text-sand md:text-3xl">
            De l&apos;idée à la startup
          </h1>
          <p className="mb-9 max-w-xl text-base font-light leading-relaxed text-cream/80 md:text-lg">
            La plateforme tunisienne qui accompagne les entrepreneurs jusqu&apos;au financement —
            avec méthode, clarté juridique et accès investisseurs.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/auth">
              <Button size="lg" variant="accent">
                Choisir mon profil
              </Button>
            </Link>
            <a
              href="#pilier"
              className="border-b border-coral/50 pb-0.5 text-sm text-sand transition-colors hover:border-coral hover:text-cream"
            >
              Découvrir les piliers
            </a>
          </div>
        </div>
      </section>

      <section id="pilier" className="bg-cream py-16 md:py-22">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-coral">
            Les trois piliers
          </p>
          <h2 className="mt-3 mb-4 font-display text-3xl text-ink">
            Tout ce qu&apos;il faut, dans le bon ordre
          </h2>
          <p className="mb-12 max-w-xl text-lg font-light text-muted">
            Startupy structure votre progression : comprendre, sécuriser, financer.
          </p>
          <div className="grid border-t border-sand md:grid-cols-3 md:border-t-0 md:border-l md:border-sand">
            {pillars.map((p) => (
              <article
                key={p.num}
                className="border-b border-sand py-10 md:min-h-[280px] md:border-b-0 md:border-r md:border-sand md:px-8 md:py-0"
              >
                <span className="mb-6 block font-display text-xl text-coral">{p.num}</span>
                <h3 className="text-xl text-ink">{p.title}</h3>
                <p className="mt-3 max-w-sm font-light text-muted">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-sand bg-gradient-to-br from-cream-deep to-sand py-16 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-8 px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-coral">Commencer</p>
            <h2 className="mt-3 mb-3 font-display text-2xl md:text-3xl">
              Entrepreneur ou investisseur ?
            </h2>
            <p className="max-w-md font-light text-muted">
              Créez votre compte selon votre rôle. L&apos;assistant juridique reste disponible en
              bas à droite.
            </p>
          </div>
          <Link href="/auth">
            <Button size="lg" variant="accent">
              Se connecter / S&apos;inscrire
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
