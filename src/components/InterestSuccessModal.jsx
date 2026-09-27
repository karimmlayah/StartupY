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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl shadow-blue-500/20 border border-slate-100 transform animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
            Match Protocol Initiated
          </span>

          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Interest request sent to the startup.
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            We have securely dispatched your investor profile, thesis alignment score, and contact mandate to the founding team of <strong className="text-slate-900">{startupName}</strong>.
          </p>
        </div>

        {/* Next Steps Card */}
        <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            What happens next:
          </h4>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <p>Founder receives an instant notification in their Startup Dashboard with your check size.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <p>Upon founder acceptance, access to their confidential pitch deck and data room is unlocked.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <p>A direct intro thread is created with suggested 20-minute introductory meeting slots.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/dashboard/investor"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-md shadow-blue-500/20 transition-all text-sm"
          >
            <span>View in Investor Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
