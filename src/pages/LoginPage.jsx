import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  Rocket,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_ROLES = [
  {
    role: 'startup',
    label: 'Continue as Startup',
    email: 'startup@demo.local',
    icon: Rocket,
    desc: 'Founder space & roadmap'
  },
  {
    role: 'investor',
    label: 'Continue as Investor',
    email: 'investor@demo.local',
    icon: TrendingUp,
    desc: 'Deal flow & investments'
  },
  {
    role: 'admin',
    label: 'Continue as Admin',
    email: 'admin@demo.local',
    icon: ShieldCheck,
    desc: 'Platform management'
  }
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterAuth = (userRole) => {
    if (location.state?.from?.pathname) {
      navigate(location.state.from.pathname);
      return;
    }
    if (userRole === 'admin') navigate('/admin');
    else if (userRole === 'investor') navigate('/investor');
    else if (userRole === 'startup') navigate('/startup');
    else navigate('/choose-role');
  };

  const handleSelectRole = (r) => {
    setSelectedRole(r.role);
    setEmail(r.email);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez saisir votre adresse e-mail et votre mot de passe.');
      return;
    }

    try {
      setLoading(true);
      const res = await signIn({ email, password });
      const userRole = res?.user?.role || res?.profile?.role;
      redirectAfterAuth(userRole);
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'Connexion impossible. Vérifiez vos identifiants puis réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-surface-elevated p-8 sm:p-10 rounded-xl border border-sand shadow-sm relative">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/40 text-xs font-semibold text-coral">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portail Sécurisé StartupY</span>
          </div>
          <h1 className="text-3xl font-semibold text-ink tracking-tight">
            Se connecter à StartupY
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Accédez à votre espace selon votre profil d'activité.
          </p>
        </div>

        {/* 3 Role Selection Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-brown-mid uppercase tracking-wider text-center">
            Sélection rapide par profil
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.role || email === r.email;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleSelectRole(r)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-coral bg-coral/10 text-coral shadow-sm ring-2 ring-coral/20' 
                      : 'border-sand bg-surface text-ink hover:border-coral/40 hover:bg-sand/30'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold leading-tight line-clamp-1">
                    {r.label.replace('Continue as ', '')}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedRole && (
            <div className="text-[11px] text-center text-muted bg-surface p-2 rounded-lg border border-sand">
              Compte démo {selectedRole} : <span className="font-mono text-ink font-semibold">{email}</span>
              <br />
              <span className="text-taupe">Mot de passe de test : <code className="font-mono text-ink font-semibold">DemoPassword123!</code></span>
            </div>
          )}
        </div>

        {location.state?.message && (
          <div className="p-3.5 rounded-lg bg-warning-bg/10 border border-warning/30 text-warning text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{location.state.message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-lg bg-danger-bg border border-danger/30 text-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brown-mid">Adresse e-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-taupe absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="vous@exemple.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-sand text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brown-mid">Mot de passe</label>
              <Link to="/forgot-password" className="text-xs text-coral hover:text-coral font-medium">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-taupe absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-sand text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-coral transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Connexion…' : (selectedRole ? `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : 'Se connecter')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center pt-1 text-xs text-muted">
          Nouveau sur StartupY ?{' '}
          <Link to="/register" className="font-bold text-coral hover:text-coral">
            Créer un compte
          </Link>
        </div>

      </div>
    </div>
  );
}
