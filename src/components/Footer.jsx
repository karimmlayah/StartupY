import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="dark-surface mt-20 bg-ink px-6 pb-8 pt-16 text-sand">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_1fr]">
        <div className="max-w-sm">
          <div className="font-display text-2xl font-semibold text-cream">Startup<span className="text-coral">Y</span></div>
          <p className="mt-3 text-sm font-light leading-relaxed text-sand/80">De l’idée au financement — un parcours intelligent conçu pour les entrepreneurs et investisseurs en Tunisie.</p>
        </div>
        <div className="flex items-start justify-end gap-6 text-sm text-sand">
          <Link to="/login" className="hover:text-cream">Se connecter</Link>
          <Link to="/register" className="hover:text-cream">Créer un compte</Link>
        </div>
        <div className="col-span-full flex flex-wrap justify-between gap-3 border-t border-sand/20 pt-8 text-sm text-taupe">
          <span>© {new Date().getFullYear()} StartupY</span>
          <span className="tracking-wide text-coral">Capital intelligent · impact tunisien</span>
        </div>
      </div>
    </footer>
  );
}
