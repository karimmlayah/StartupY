import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, Map, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const pillars = [
    { icon: Map, title: 'Un parcours structuré', body: 'Des étapes claires pour transformer une idée en entreprise prête à grandir.' },
    { icon: ShieldCheck, title: 'Un écosystème vérifié', body: 'Les profils et accès sensibles sont contrôlés avant leur mise en relation.' },
    { icon: Handshake, title: 'Des connexions pertinentes', body: 'StartupY rapproche les startups tunisiennes et les investisseurs selon leurs objectifs.' },
  ];

  return (
    <div>
      <section className="px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-coral">Écosystème startup tunisien</p>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.04] text-ink sm:text-6xl lg:text-7xl">
            De l’idée au financement,<br /><span className="text-coral">avancez avec clarté.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-light leading-relaxed text-muted md:text-xl">
            StartupY accompagne les entrepreneurs, structure leur progression et facilite des rencontres de confiance avec des investisseurs vérifiés.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="inline-flex items-center justify-center rounded-md border border-sand bg-surface px-7 py-4 text-sm font-medium text-ink hover:border-coral/40">Se connecter</Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-md bg-coral px-7 py-4 text-sm font-medium text-white shadow-sm hover:bg-coral-dark">Créer un compte <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-sand bg-surface px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mx-auto mb-14 max-w-2xl text-center font-display text-3xl text-ink md:text-4xl">Une plateforme commune, adaptée à chaque rôle.</h2>
          <div className="grid border-t border-sand md:grid-cols-3 md:border-l md:border-t-0">
            {pillars.map(({ icon: Icon, title, body }) => (
              <article key={title} className="border-b border-sand p-8 text-left md:border-b-0 md:border-r">
                <Icon className="size-6 text-coral" />
                <h3 className="mt-8 text-2xl text-ink">{title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-muted">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Link to="/register?intent=startup" className="rounded-lg border border-sand bg-surface-elevated p-7 shadow-sm hover:border-coral/40">
              <p className="text-xs font-medium uppercase tracking-wider text-coral">Entrepreneurs</p>
              <h3 className="mt-3 text-2xl">Structurer mon projet</h3>
              <p className="mt-2 text-sm text-muted">Créez un compte pour démarrer votre parcours fondateur.</p>
            </Link>
            <Link to="/register?intent=investor" className="rounded-lg border border-sand bg-surface-elevated p-7 shadow-sm hover:border-coral/40">
              <p className="text-xs font-medium uppercase tracking-wider text-coral">Investisseurs</p>
              <h3 className="mt-3 text-2xl">Rejoindre le réseau</h3>
              <p className="mt-2 text-sm text-muted">Créez un compte puis soumettez votre profil à vérification.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
