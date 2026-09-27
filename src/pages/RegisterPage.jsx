import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d’utilisation et la politique de confidentialité.');
      return;
    }

    try {
      setLoading(true);
      await signUp({ fullName, email, password });
      navigate('/choose-role' + (location.search || ''), { replace: true });
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Impossible de créer votre compte pour le moment. Vérifiez les informations puis réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-elevated p-8 sm:p-10 rounded-xl border border-sand shadow-sm relative">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/40 text-xs font-semibold text-coral">
            <Sparkles className="w-3.5 h-3.5" />
            <span>StartupY</span>
          </div>
          <h1 className="text-3xl font-semibold text-ink tracking-tight">
            Créer un compte
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Rejoignez la plateforme et choisissez ensuite l’espace adapté à votre activité.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-danger-bg border border-danger/30 text-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brown-mid">Nom complet</label>
            <div className="relative">
              <User className="w-4 h-4 text-taupe absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Votre nom complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-sand text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
            </div>
          </div>

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
            <label className="text-xs font-bold text-brown-mid">Mot de passe</label>
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brown-mid">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-taupe absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-sand text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
            </div>
          </div>

          {/* Accept Terms Checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 rounded bg-surface border-sand text-coral focus:ring-coral/30"
            />
            <label htmlFor="terms" className="text-xs text-muted">
              J’accepte les <Link to="/resources" className="text-coral hover:underline">conditions d’utilisation</Link> et la <span className="text-brown-mid">politique de confidentialité de StartupY</span>.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-white bg-coral transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Création du compte…' : 'Créer mon compte'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Existing account link */}
        <div className="text-center pt-2 text-xs text-muted">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-bold text-coral hover:text-coral">
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  );
}
