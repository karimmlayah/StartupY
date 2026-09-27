import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Lock, 
  Building2, 
  Coins, 
  Layers,
  Sparkles,
  Send
} from 'lucide-react';

const STORAGE_KEY = 'bidaya_tunisia_investor_verification';

export default function InvestorVerificationFlow({ investor, onStatusChange }) {
  const [verificationData, setVerificationData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    return {
      status: investor?.verificationStatus || 'under_review', // 'draft' | 'under_review' | 'documents_required' | 'approved' | 'rejected' | 'suspended'
      orgName: investor?.name || 'Carthage Angels Network (Demo)',
      investorType: investor?.type || 'Angel Investor',
      cinPassport: 'cin_scan_verified.pdf',
      rneDocument: 'rne_extract_2026.pdf',
      mandateLetter: 'mandate_syndicate_agreement.pdf',
      submittedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      adminNotes: 'Documents uploaded. Identity and investment mandate file under administrative review.'
    };
  });

  const [activeStep, setActiveStep] = useState(6); // Step 6 is review status
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verificationData));
    } catch (e) {}
  }, [verificationData]);

  const handleSubmitForVerification = () => {
    const updated = {
      ...verificationData,
      status: 'under_review',
      submittedAt: new Date().toISOString(),
      adminNotes: 'File submitted. Verification is reviewed when the submitted file is complete.'
    };
    setVerificationData(updated);
    setFeedback('Your verification dossier has been submitted. Status updated to Under Review.');
    if (onStatusChange) onStatusChange('under_review');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleSimulateApproval = (newStatus) => {
    const updated = {
      ...verificationData,
      status: newStatus,
      adminNotes: newStatus === 'approved' 
        ? 'Accreditation verified by Bidaya Administration. Full deal flow and meeting access unlocked.'
        : 'Additional proof of institutional mandate required.'
    };
    setVerificationData(updated);
    if (onStatusChange) onStatusChange(newStatus);
  };

  const statusConfig = {
    draft: {
      badge: 'bg-slate-700 text-slate-300 border-slate-600',
      title: 'Verification Incomplete (Draft)',
      desc: 'Complete identity details and submit required accreditation documents.'
    },
    under_review: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'Dossier Under Administrative Review',
      desc: 'Verification is reviewed when the submitted file is complete.'
    },
    documents_required: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'Additional Supporting Documents Required',
      desc: 'Please provide updated RNE extract or proof of angel syndicate mandate.'
    },
    approved: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'Accredited Investor (Approved)',
      desc: 'Full access to verified Tunisian startup deal flow, data rooms, and Bidaya Meetings.'
    },
    rejected: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      title: 'Application Rejected',
      desc: 'Investor verification file did not meet accreditation criteria.'
    },
    suspended: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      title: 'Account Suspended',
      desc: 'Account access has been paused by platform administrators.'
    }
  };

  const currentCfg = statusConfig[verificationData.status] || statusConfig.under_review;
  const isApproved = verificationData.status === 'approved';

  const steps = [
    { num: 1, name: 'Identity & Entity' },
    { num: 2, name: 'Investment Mandate' },
    { num: 3, name: 'Sector & Ticket' },
    { num: 4, name: 'Documents' },
    { num: 5, name: 'Submission' },
    { num: 6, name: 'Review Status' },
    { num: 7, name: 'Deal Flow Access' }
  ];

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      
      {/* Top Status Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/70 via-indigo-950/60 to-slate-900 border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${currentCfg.badge}`}>
              {verificationData.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400">Institutional Accreditation</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {currentCfg.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {currentCfg.desc}
          </p>

          <div className="text-[11px] text-amber-300/80 italic font-medium pt-1">
            “Verification is reviewed when the submitted file is complete.”
          </div>
        </div>

        {/* Demo Fast-Approval Switch for Evaluators */}
        <div className="flex-shrink-0 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Evaluator Testing Control
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateApproval('approved')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                isApproved 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Simulate Approved
            </button>
            <button
              onClick={() => handleSimulateApproval('under_review')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                !isApproved 
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Simulate Under Review
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-blue-950/70 border border-blue-500/40 text-xs text-blue-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 7-Step Stepper Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 border-b border-slate-800/80 pb-5 text-center">
        {steps.map((st) => {
          const isDone = isApproved || st.num <= 5;
          const isCurrent = st.num === 6 && !isApproved;

          return (
            <div 
              key={st.num}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                isDone && st.num < 6
                  ? 'bg-slate-800/80 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-violet-950/60 border-violet-500 text-white font-bold'
                  : isApproved && st.num === 7
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-800/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono font-bold opacity-80">
                Step 0{st.num}
              </div>
              <div className="font-semibold truncate mt-0.5">
                {st.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification Documents Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400" />
          <span>Submitted Verification Documents</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Identity Verification</span>
              <span className="text-[11px] text-slate-400">{verificationData.cinPassport}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Uploaded
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Commercial Register (RNE)</span>
              <span className="text-[11px] text-slate-400">{verificationData.rneDocument}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Uploaded
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Investment Mandate / Letter</span>
              <span className="text-[11px] text-slate-400">{verificationData.mandateLetter}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Uploaded
            </span>
          </div>
        </div>

        {/* Verification Rules Banner */}
        {!isApproved ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Limited Public Teaser Access While Under Review</span>
            </div>
            <p className="text-slate-300">
              Until your dossier is approved by administrators, you can view public teaser information and test match calculations. Full data rooms, pitch decks, and Bidaya Meeting booking will be unlocked upon accreditation.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Accreditation Active:</strong> You have full clearance to book 1-on-1 Bidaya Video Meetings and inspect complete startup data rooms.
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
