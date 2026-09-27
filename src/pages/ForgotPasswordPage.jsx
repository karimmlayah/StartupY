import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      console.error('Password reset failed:', err);
      setError(err.message || 'Failed to send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-elevated p-8 sm:p-10 rounded-xl border border-sand shadow-sm relative text-center">
        
        <div className="w-14 h-14 rounded-lg bg-coral text-white flex items-center justify-center mx-auto shadow-sm">
          <KeyRound className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-5 rounded-lg bg-success-bg/10 border border-success/30 text-success text-xs space-y-3">
            <CheckCircle2 className="w-8 h-8 mx-auto text-success" />
            <p className="font-semibold text-white">Reset Link Dispatched</p>
            <p>
              If an account exists for <strong>{email}</strong>, a recovery link has been sent. Check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-bold text-xs text-coral hover:text-white pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3.5 rounded-lg bg-danger-bg0/10 border border-danger/30 text-danger text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-brown-mid">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-taupe absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your.email@tunisia.tn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-sand text-sm text-white focus:outline-none focus:ring-2 focus:ring-coral/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-coral transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Sending...' : 'Send Recovery Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs text-muted hover:text-white font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
