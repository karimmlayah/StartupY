import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, LoaderCircle, Rocket, ShieldCheck, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const dashboardForRole = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'investor') return '/investor';
  return '/startup';
};

export default function ChooseRolePage() {
  const navigate = useNavigate();
  const {
    user,
    profile,
    role,
    loading: authLoading,
    profileLoading,
    profileError,
    retryProfile,
    chooseRole,
    signOut,
  } = useAuth();

  const [submittingRole, setSubmittingRole] = useState(null);
  const [actionError, setActionError] = useState('');
  const [retrying, setRetrying] = useState(false);

  const assignedRole = ['admin', 'investor', 'startup'].includes(role) ? role : null;

  if (assignedRole) return <Navigate to={dashboardForRole(assignedRole)} replace />;

  const isLoading = authLoading || profileLoading || (user && !profile && !profileError);

  const handleChooseRole = async (selectedRole) => {
    if (submittingRole) return;
    setSubmittingRole(selectedRole);
    setActionError('');
    try {
      await chooseRole(selectedRole);
      navigate(dashboardForRole(selectedRole), { replace: true });
    } catch (error) {
      console.error('Role assignment failed:', error);
      setActionError(
        selectedRole === 'admin'
          ? 'Ce compte n’est pas préautorisé comme administrateur. Connectez-vous avec un compte administrateur autorisé.'
          : 'Impossible d’enregistrer ce rôle pour le moment. Réessayez.'
      );
      setSubmittingRole(null);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    setActionError('');
    try {
      await retryProfile();
    } finally {
      setRetrying(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-cream px-6" aria-live="polite">
        <div className="flex flex-col items-center gap-4 text-center">
          <LoaderCircle className="size-10 animate-spin text-coral" aria-hidden="true" />
          <p className="text-sm font-medium text-ink">Chargement de votre profil…</p>
        </div>
      </section>
    );
  }

  if (profileError) {
    return (
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-cream px-6 py-16">
        <div className="w-full max-w-lg rounded-xl border border-danger/30 bg-surface-elevated p-8 text-center shadow-sm">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-danger-bg text-danger">
            <AlertCircle className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-ink">Votre profil n’a pas pu être chargé</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{profileError}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={handleRetry} disabled={retrying} className="inline-flex items-center justify-center rounded-md bg-coral px-5 py-2.5 text-sm font-medium text-white hover:bg-coral-dark disabled:cursor-wait disabled:opacity-60">
              {retrying && <LoaderCircle className="mr-2 size-4 animate-spin" />}
              Réessayer
            </button>
            <button type="button" onClick={handleSignOut} className="rounded-md border border-sand bg-surface px-5 py-2.5 text-sm font-medium text-ink hover:border-coral/40">
              Se déconnecter
            </button>
          </div>
        </div>
      </section>
    );
  }

  const cards = [
    {
      role: 'admin',
      title: 'Administrateur',
      description: 'Gérez les validations et le fonctionnement de la plateforme avec un compte préautorisé.',
      action: 'Continue as Admin',
      Icon: ShieldCheck,
    },
    {
      role: 'investor',
      title: 'Investisseur',
      description: 'Découvrez des startups tunisiennes vérifiées selon vos critères.',
      action: 'Continue as Investor',
      Icon: TrendingUp,
    },
    {
      role: 'startup',
      title: 'Startup',
      description: 'Transformez votre idée en startup prête à rencontrer des investisseurs.',
      action: 'Continue as Startup',
      Icon: Rocket,
    },
  ];

  return (
    <section className="min-h-[calc(100vh-72px)] bg-cream px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-coral">Votre espace StartupY</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold text-ink sm:text-5xl">
            Choisissez votre espace StartupY
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
            Votre choix est enregistré dans votre profil sécurisé. L’accès administrateur exige une préautorisation.
          </p>
        </header>

        {actionError && (
          <div className="mx-auto mt-7 flex max-w-xl items-start gap-3 rounded-lg border border-danger/30 bg-danger-bg p-4 text-left text-sm text-danger" role="alert">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ role: cardRole, title, description, action, Icon }) => {
            const selected = submittingRole === cardRole;
            return (
              <article key={cardRole} className={`flex min-h-72 flex-col rounded-xl border bg-surface-elevated p-7 shadow-sm transition sm:p-8 ${selected ? 'border-coral ring-4 ring-coral/10' : 'border-sand hover:border-coral/40'}`}>
                <span className="flex size-12 items-center justify-center rounded-lg bg-coral/10 text-coral">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-7 text-2xl font-semibold text-ink">{title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">{description}</p>
                <button
                  type="button"
                  onClick={() => handleChooseRole(cardRole)}
                  disabled={Boolean(submittingRole)}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-coral px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-coral-dark disabled:cursor-wait disabled:opacity-60"
                >
                  {selected ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                  {selected ? 'Enregistrement…' : action}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
