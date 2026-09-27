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
import { updateInvestorReview } from '../lib/supabaseData';

export default function InvestorVerificationFlow({ investor, onStatusChange }) {
  const [verificationData, setVerificationData] = useState(() => ({
      status: investor?.verificationStatus || 'draft',
      orgName: investor?.name || '',
      investorType: investor?.type || 'Angel Investor',
      adminNotes: investor?.verification_notes || ''
    }));

  const [activeStep, setActiveStep] = useState(6); // Step 6 is review status
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setVerificationData({ status: investor?.verificationStatus || 'draft', orgName: investor?.name || '', investorType: investor?.type || 'Angel Investor', adminNotes: investor?.verification_notes || '' });
  }, [investor]);

  const handleSubmitForVerification = async () => {
    const updated = {
      ...verificationData,
      status: 'under_review',
      submittedAt: new Date().toISOString(),
      adminNotes: 'File submitted. Verification is reviewed when the submitted file is complete.'
    };
    setVerificationData(updated);
    if (investor?.id) await updateInvestorReview(investor.id, 'under_review', updated.adminNotes).catch(() => {});
    setFeedback('Your verification dossier has been submitted. Status updated to Under Review.');
    if (onStatusChange) onStatusChange('under_review');
    setTimeout(() => setFeedback(''), 4000);
  };

  const statusConfig = {
    draft: {
      badge: 'bg-sand text-brown-mid border-sand',
      title: 'Verification Incomplete (Draft)',
      desc: 'Complete identity details and submit required accreditation documents.'
    },
    under_review: {
      badge: 'bg-warning-bg/20 text-warning border-warning/30',
      title: 'Dossier Under Administrative Review',
      desc: 'Verification is reviewed when the submitted file is complete.'
    },
    documents_required: {
      badge: 'bg-warning-bg/20 text-warning border-warning/30',
      title: 'Additional Supporting Documents Required',
      desc: 'Please provide updated RNE extract or proof of angel syndicate mandate.'
    },
    approved: {
      badge: 'bg-success-bg/20 text-success border-success/30',
      title: 'Accredited Investor (Approved)',
      desc: 'Full access to verified Tunisian startup deal flow, data rooms, and Bidaya Meetings.'
    },
    rejected: {
      badge: 'bg-danger-bg0/20 text-danger border-danger/30',
      title: 'Application Rejected',
      desc: 'Investor verification file did not meet accreditation criteria.'
    },
    suspended: {
      badge: 'bg-danger-bg0/20 text-danger border-danger/30',
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
    <div className="bg-surface-elevated rounded-xl p-6 sm:p-8 border border-sand shadow-md space-y-6">
      
      {/* Top Status Card */}
      <div className="p-6 rounded-lg bg-coral border border-coral/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${currentCfg.badge}`}>
              {verificationData.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-muted">Institutional Accreditation</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            {currentCfg.title}
          </h2>

          <p className="text-xs sm:text-sm text-brown-mid max-w-xl">
            {currentCfg.desc}
          </p>

          <div className="text-[11px] text-warning/80 italic font-medium pt-1">
            “Verification is reviewed when the submitted file is complete.”
          </div>
        </div>

      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-coral/10 border border-coral/40 text-xs text-coral flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 7-Step Stepper Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 border-b border-sand pb-5 text-center">
        {steps.map((st) => {
          const isDone = isApproved || st.num <= 5;
          const isCurrent = st.num === 6 && !isApproved;

          return (
            <div 
              key={st.num}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                isDone && st.num < 6
                  ? 'bg-surface border-success/30 text-success'
                  : isCurrent
                  ? 'bg-coral/10 border-coral/40 text-white font-bold'
                  : isApproved && st.num === 7
                  ? 'bg-success-bg border-success/30 text-success font-bold'
                  : 'bg-surface/40 border-sand text-taupe'
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
          <FileText className="w-4 h-4 text-coral" />
          <span>Submitted Verification Documents</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-surface border border-sand flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Identity Verification</span>
              <span className="text-[11px] text-muted">Managed by the verification team</span>
            </div>
            <span className="text-[10px] font-bold text-success bg-success-bg px-2 py-0.5 rounded border border-success/30">
              Required
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-sand flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Commercial Register (RNE)</span>
              <span className="text-[11px] text-muted">Managed by the verification team</span>
            </div>
            <span className="text-[10px] font-bold text-success bg-success-bg px-2 py-0.5 rounded border border-success/30">
              Required
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-sand flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Investment Mandate / Letter</span>
              <span className="text-[11px] text-muted">Managed by the verification team</span>
            </div>
            <span className="text-[10px] font-bold text-success bg-success-bg px-2 py-0.5 rounded border border-success/30">
              Required
            </span>
          </div>
        </div>

        {/* Verification Rules Banner */}
        {!isApproved ? (
          <div className="p-4 rounded-lg bg-warning-bg/10 border border-warning/30 text-xs text-warning space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Lock className="w-4 h-4 text-warning" />
              <span>Limited Public Teaser Access While Under Review</span>
            </div>
            <p className="text-brown-mid">
              Until your dossier is approved by administrators, you can view public teaser information and test match calculations. Full data rooms, pitch decks, and Bidaya Meeting booking will be unlocked upon accreditation.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-success-bg/10 border border-success/30 text-xs text-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            <span>
              <strong>Accreditation Active:</strong> You have full clearance to book 1-on-1 Bidaya Video Meetings and inspect complete startup data rooms.
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
