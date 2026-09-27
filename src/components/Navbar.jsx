import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const links = !user
    ? []
    : role === 'startup'
      ? [
          { name: 'Mon parcours', path: '/startup' },
          { name: 'Idea Lab', path: '/founder-workspace' },
          { name: 'Roadmap', path: '/roadmap' },
          { name: 'Réunions', path: '/startup-meetings' },
        ]
      : role === 'investor'
        ? [
            { name: 'Tableau de bord', path: '/investor' },
            { name: 'Deal flow', path: '/deal-flow' },
            { name: 'Vérification', path: '/investor-verification' },
            { name: 'Réunions', path: '/investor-meetings' },
          ]
        : role === 'admin'
          ? [{ name: 'Administration', path: '/admin' }, { name: 'Deal flow', path: '/deal-flow' }]
          : [{ name: 'Choisir un rôle', path: '/choose-role' }];

  const active = (path) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const logout = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-sand/70 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="StartupY — Accueil">
          <span className="size-8 rounded-md bg-coral shadow-sm flex items-center justify-center text-white font-bold text-base" aria-hidden>Y</span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">Startup<span className="text-coral">Y</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {links.map((link) => (
            <Link key={link.name} to={link.path}
              className={`rounded-md px-3.5 py-2 text-sm transition-colors ${active(link.path) ? 'bg-coral/10 text-ink' : 'text-muted hover:bg-coral/10 hover:text-ink'}`}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button onClick={logout} className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-xs text-muted hover:bg-ink/5 hover:text-ink md:flex"><LogOut className="size-3.5" />Déconnexion</button>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="rounded-md border border-sand bg-surface px-3.5 py-2 text-xs font-medium text-ink hover:border-coral/40">Connexion</Link>
              <Link to="/register" className="rounded-md bg-coral px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-coral-dark">Commencer</Link>
            </div>
          )}
          <button onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-md p-2 text-muted hover:bg-ink/5 md:hidden" aria-label="Ouvrir le menu">
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-sand bg-cream px-4 py-4 shadow-md md:hidden">
          <div className="mx-auto max-w-7xl space-y-1">
            {links.map((link) => <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-muted hover:bg-coral/10 hover:text-ink">{link.name}</Link>)}
            <div className="mt-2 border-t border-sand pt-3">
              {user ? <button onClick={logout} className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted"><LogOut className="size-4" />Déconnexion</button> : <div className="grid grid-cols-2 gap-2"><Link to="/login" className="rounded-md border border-sand px-4 py-2.5 text-center text-sm">Connexion</Link><Link to="/register" className="rounded-md bg-coral px-4 py-2.5 text-center text-sm text-white">Commencer</Link></div>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
