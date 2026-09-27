import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, switchDemoRole, isDemoMode } = useAuth();

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
    else if (userRole === 'investor') navigate('/dashboard/investor');
    else if (userRole === 'startup') navigate('/dashboard/startup');
    else navigate('/choose-role');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await signIn({ email, password });
      const userRole = res?.user?.role || res?.user?.user_metadata?.role;
      redirectAfterAuth(userRole);
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins for smooth evaluation
  const handleQuickDemo = (demoType) => {
    switchDemoRole(demoType);
    if (demoType === 'admin') navigate('/admin');
    else if (demoType === 'investor') navigate('/dashboard/investor');
    else navigate('/dashboard/startup');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900/90 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Secure Access Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Sign In to Bidaya
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Access your startup roadmap, deal flow watchlist, or admin console.
          </p>
        </div>

        {location.state?.message && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{location.state.message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="founder@agrismart.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Mode Quick Access Strip */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Demo Logins</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {isDemoMode ? 'Demo Mode Active' : 'Supabase Live'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('startup')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all text-center text-[11px] hover:border-blue-500"
            >
              Startup Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('investor')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all text-center text-[11px] hover:border-violet-500"
            >
              Investor Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold transition-all text-center text-[11px] hover:bg-amber-950/40"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center pt-1 text-xs text-slate-400">
          New to Bidaya Tunisia?{' '}
          <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}
