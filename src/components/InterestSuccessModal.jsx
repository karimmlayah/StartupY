import React from 'react';
import { CheckCircle2, X, Send, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InterestSuccessModal({ 
  isOpen, 
  onClose, 
  startupName = "the startup" 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cream backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-surface-elevated rounded-xl p-6 sm:p-8 text-ink shadow-sm border border-sand transform animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted hover:text-brown-mid hover:bg-sand/60 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-lg bg-success-bg text-success shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-success bg-success-bg px-3 py-1 rounded-full border border-success/30 mb-2">
            Tunisian Ecosystem Protocol Initiated
          </span>

          <h3 className="text-2xl font-semibold text-ink tracking-tight mb-2">
            Interest request sent to the startup.
          </h3>

          <p className="text-sm text-muted leading-relaxed mb-6">
            We have securely dispatched your investor profile, ticket size in TND, and contact mandate to the founding team of <strong className="text-ink">{startupName}</strong>.
          </p>
        </div>

        {/* Next Steps Card */}
        <div className="space-y-3 bg-surface rounded-lg p-4 border border-sand/80 mb-6 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-taupe">
            What happens next:
          </h4>
          <div className="space-y-2.5 text-xs text-brown-mid">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-coral/10 text-coral flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <p>The Tunisian founder receives an instant notification in their Startup Dashboard with your check size in TND.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-coral/10 text-coral flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <p>Upon founder acceptance, access to their confidential pitch deck and data room is unlocked.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-success-bg text-success flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <p>A direct intro thread is generated to coordinate an initial meeting (in Tunis, Sfax, Sousse, or remote video).</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/dashboard/investor"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-white bg-coral shadow-md transition-all text-sm"
          >
            <span>View in Investor Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl font-medium text-brown-mid bg-sand/60 hover:bg-sand transition-colors text-sm cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
