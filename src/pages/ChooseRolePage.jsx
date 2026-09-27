import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  Rocket, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChooseRolePage() {
  const navigate = useNavigate();
  const { user, role, chooseRole, loading: authLoading } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If the user already has a role, they cannot change it. Redirect to appropriate dashboard.
  if (role) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'investor') return <Navigate to="/dashboard/investor" replace />;
    return <Navigate to="/dashboard/startup" replace />;
  }

  const handleConfirmRole = async () => {
    if (!selectedRole) {
      setError('Please select one of the two roles below.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await chooseRole(selectedRole);

      if (selectedRole === 'investor') {
        navigate('/dashboard/investor');
      } else {
        navigate('/dashboard/startup');
      }
    } catch (err) {
      console.error('Failed to assign role:', err);
      setError(err.message || 'Failed to save role choice.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 text-center">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-800/60 text-xs font-semibold text-violet-300">
            <Lock className="w-3.5 h-3.5" />
            <span>One-Time Role Assignment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How will you participate on Bidaya?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Choose your account role carefully. To preserve institutional integrity, your role is permanent and cannot be changed once confirmed.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Two Required Role Cards: Startup Founder & Investor (No Admin Card) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* Card 1: Startup Founder */}
          <div 
            onClick={() => setSelectedRole('startup')}
            className={`p-7 rounded-3xl border-2 transition-all cursor-pointer relative group flex flex-col justify-between ${
              selectedRole === 'startup'
                ? 'bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/10'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            {selectedRole === 'startup' && (
              <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <Rocket className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  I am a Startup Founder
                </h3>
                <p className="text-xs text-blue-400 font-semibold mt-0.5">
                  Tunisian Venture Builder
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Build your verified startup roadmap, track readiness for the Tunisian Startup Act, calculate objective match scores, and schedule private Bidaya Video Meetings with verified investors.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-2">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>11-step structured roadmap</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Explainable Smart Match Engine</span>
              </div>
            </div>
          </div>

          {/* Card 2: Investor */}
          <div 
            onClick={() => setSelectedRole('investor')}
            className={`p-7 rounded-3xl border-2 transition-all cursor-pointer relative group flex flex-col justify-between ${
              selectedRole === 'investor'
                ? 'bg-slate-900 border-violet-500 shadow-2xl shadow-violet-500/20 ring-4 ring-violet-500/10'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            {selectedRole === 'investor' && (
              <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-violet-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  I am an Investor
                </h3>
                <p className="text-xs text-violet-400 font-semibold mt-0.5">
                  Angel, Fund, Corporate or Diaspora
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Deploy smart capital in Tunisian Dinars. Complete our investor verification to access approved deal flow, review due diligence packages, and conduct 1-on-1 Bidaya Meetings.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-2">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                <span>Accreditation & verification process</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                <span>Access approved Tunisian deal flow</span>
              </div>
            </div>
          </div>

        </div>

        {/* Confirmation Button */}
        <div className="pt-4 max-w-sm mx-auto">
          <button
            onClick={handleConfirmRole}
            disabled={!selectedRole || submitting}
            className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedRole && !submitting
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-blue-600/30 hover:scale-[1.02]'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            <span>{submitting ? 'Confirming Role...' : 'Confirm Role Selection'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-slate-500 mt-2">
            Selected role is saved permanently to your profile record.
          </p>
        </div>

      </div>
    </div>
  );
}
