import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  FileText, 
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  Award,
  Zap
} from 'lucide-react';

const STORAGE_KEY = 'bidaya_tunisia_startup_roadmap';

export const ROADMAP_STEPS = [
  {
    step: 1,
    title: 'Founder Diagnostic',
    tag: 'Foundational',
    summary: 'Evaluate founder alignment, technical capabilities, full-time commitment and financial runway.',
    mandatoryForMvp: true,
    checklist: [
      'Full-time commitment of founding team confirmed',
      'Co-founder equity split and vesting schedule drafted',
      'Personal financial runway (minimum 12 months) evaluated'
    ],
    deliverables: ['Founder skills matrix', 'Founding team commitment memo'],
    aiPrompt: 'How should a Tunisian startup founder structure equity split and founder vesting schedules under Tunisian corporate standards?'
  },
  {
    step: 2,
    title: 'Problem & Customer Validation',
    tag: 'Discovery',
    summary: 'Validate the customer pain point through structured discovery interviews with Tunisian target users.',
    mandatoryForMvp: true,
    checklist: [
      'Completed at least 15 customer discovery interviews in Tunisia',
      'Identified critical burning pain point vs nice-to-have',
      'Documented current workaround solutions and budget allocated'
    ],
    deliverables: ['Customer interview synthesis report', 'Target user personas'],
    aiPrompt: 'What questions should I ask Tunisian B2B and consumer customers to validate willingness-to-pay for our tech product?'
  },
  {
    step: 3,
    title: 'Tunisian Market Research',
    tag: 'Market Fit',
    summary: 'Quantify addressable market size (TAM, SAM, SOM) in Tunisian Dinars (TND) and regional reach.',
    mandatoryForMvp: true,
    checklist: [
      'Calculated TAM, SAM, SOM in Tunisian Dinars (TND)',
      'Competitive landscape mapping (Tunisia, Maghreb, and Euro-Med)',
      'Governorate rollout sequence established (Tunis, Sfax, Sousse, etc.)'
    ],
    deliverables: ['Market size estimation model in TND', 'Competitor benchmarking matrix'],
    aiPrompt: 'How can I estimate the addressable market size (TAM/SAM) in Tunisian Dinars for a B2B SaaS startup in Tunisia?'
  },
  {
    step: 4,
    title: 'MVP & Solution Design',
    tag: 'Product',
    summary: 'Build a lean functional prototype addressing the core problem with measurable user engagement.',
    mandatoryForMvp: true,
    checklist: [
      'Core user journey mapped and functional prototype built',
      'Deployed to initial closed beta group (at least 5 users/clients)',
      'Weekly user retention and engagement tracked'
    ],
    deliverables: ['Working demo link or staging environment', 'Beta feedback log'],
    aiPrompt: 'What are best practices for testing an MVP with Tunisian enterprise clients and measuring pilot success?'
  },
  {
    step: 5,
    title: 'Business Model',
    tag: 'Monetization',
    summary: 'Define sustainable monetization mechanisms, pricing tiers in TND, and unit economics.',
    mandatoryForMvp: true,
    checklist: [
      'Pricing model formalized in TND with clear packaging',
      'Gross margins calculated (>60% targeted for software)',
      'Customer Acquisition Cost (CAC) and Lifetime Value (LTV) estimated'
    ],
    deliverables: ['Unit economics calculation sheet', 'Commercial pricing table in TND'],
    aiPrompt: 'What pricing strategies work best in Tunisia when selling digital software to SMEs and traditional industries?'
  },
  {
    step: 6,
    title: 'Team & Roles',
    tag: 'Governance',
    summary: 'Structure core engineering, product, and commercial roles with advisory network support.',
    mandatoryForMvp: true,
    checklist: [
      'Technical lead / CTO role clearly assigned',
      'Commercial & go-to-market lead assigned',
      'At least one industry advisor or mentor engaged'
    ],
    deliverables: ['Organizational chart & role definitions', 'Advisory board memo'],
    aiPrompt: 'How can an early-stage Tunisian startup attract senior technical talent and advisors when cash runway is limited?'
  },
  {
    step: 7,
    title: 'Legal Formation Checklist',
    tag: 'Legal',
    summary: 'Incorporate corporate entity (SARL, SUARL, SA) and complete tax registration in Tunisia.',
    mandatoryForMvp: true,
    checklist: [
      'Corporate form chosen (SUARL or SARL)',
      'Articles of Association drafted and registered at RNE (Registre National des Entreprises)',
      'Fiscal identification number (Matricule Fiscale) obtained'
    ],
    deliverables: ['RNE registration certificate', 'Bank account certificate'],
    aiPrompt: 'What are the required documents and steps to register a SARL or SUARL at the Registre National des Entreprises (RNE)?'
  },
  {
    step: 8,
    title: 'Startup Act Readiness',
    tag: 'Regulation',
    summary: 'Prepare compliance with Law 2018-20 (Startup Act) to apply for the Label Startup.',
    mandatoryForMvp: true,
    checklist: [
      'Eligibility verified (< 8 years, < 100 employees, innovative model)',
      'Pitch video and innovation documentation prepared for College de Labellisation',
      'Patent / IP protection or trademark filing registered with INNORPI'
    ],
    deliverables: ['Startup Act application package', 'INNORPI trademark filing receipt'],
    aiPrompt: 'What criteria does the Collège de Labellisation look for when reviewing an application for the Label Startup under Law 2018-20?'
  },
  {
    step: 9,
    title: 'International Operations & FX Awareness',
    tag: 'Expansion',
    summary: 'Understand Central Bank of Tunisia (BCT) foreign exchange provisions and Special Tech Accounts.',
    mandatoryForMvp: false,
    checklist: [
      'Provisions for Special Tech Account (Compte Spécial en Devises) reviewed',
      'International payment gateway compliance planned',
      'Cross-border contract and IP licensing structure reviewed'
    ],
    deliverables: ['Foreign exchange compliance memorandum', 'Export market roadmap'],
    aiPrompt: 'How does the Special Tech Account (Compte Spécial en Devises) under the Startup Act help Tunisian startups pay foreign vendors and expand abroad?'
  },
  {
    step: 10,
    title: 'Investor Readiness & Pitch Deck',
    tag: 'Fundraising',
    summary: 'Build an institutional-grade 12-slide pitch deck, cap table, and due diligence data room.',
    mandatoryForMvp: true,
    checklist: [
      '12-slide investor pitch deck completed with clear ask in TND',
      'Due diligence data room folder structured with corporate documents',
      'Cap table with post-money dilution scenarios modeled'
    ],
    deliverables: ['Investor Pitch Deck PDF', 'Data Room checklist'],
    aiPrompt: 'What are the core documents Tunisian angel investors and venture capital funds expect to see in an early-stage due diligence package?'
  },
  {
    step: 11,
    title: 'Submit for Publication',
    tag: 'Milestone',
    summary: 'Submit your verified startup profile to Bidaya platform administrators for institutional publication.',
    mandatoryForMvp: true,
    checklist: [
      'All mandatory MVP roadmap milestones completed',
      'Founding team contact information confirmed',
      'Smart Match compatibility criteria validated'
    ],
    deliverables: ['Final verified platform application'],
    aiPrompt: 'What happens after I submit my Tunisian startup profile for review on the Bidaya platform?'
  }
];

export default function StartupRoadmap({ onOpenAiGuide, onPublicationStatusChange }) {
  const [stepsData, setStepsData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    // Default progression: Steps 1-3 completed, 4 in progress, 5-11 locked
    return ROADMAP_STEPS.map((s, idx) => ({
      step: s.step,
      status: idx < 3 ? 'completed' : idx === 3 ? 'in_progress' : 'locked',
      checklist: s.checklist.map((_, itemIdx) => idx < 3 ? true : false),
      evidenceText: idx < 3 ? 'Documented and verified internally by the founding team.' : '',
      evidenceUrl: idx < 3 ? 'https://drive.google.com/demo-doc' : '',
      completedAt: idx < 3 ? new Date(Date.now() - (3 - idx) * 7 * 24 * 3600 * 1000).toISOString() : null
    }));
  });

  const [expandedStep, setExpandedStep] = useState(4); // Open current in-progress step
  const [submissionStatus, setSubmissionStatus] = useState('draft'); // 'draft' | 'under_review' | 'approved'
  const [submissionFeedback, setSubmissionFeedback] = useState('');

  // Persist roadmap steps data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stepsData));
    } catch (e) {}
  }, [stepsData]);

  // Calculate readiness score (0 - 100%)
  const completedCount = stepsData.filter(s => s.status === 'completed').length;
  const readinessScore = Math.round((completedCount / ROADMAP_STEPS.length) * 100);

  // Check if mandatory steps 1 to 10 are completed
  const mandatoryCompleted = stepsData.slice(0, 10).every(s => s.status === 'completed');

  const toggleChecklistItem = (stepNumber, itemIdx) => {
    setStepsData(prev => {
      return prev.map(s => {
        if (s.step !== stepNumber) return s;
        const newChecklist = [...s.checklist];
        newChecklist[itemIdx] = !newChecklist[itemIdx];
        
        // Auto-check if all checklist items done
        const allDone = newChecklist.every(Boolean);
        const newStatus = allDone && s.evidenceText?.trim().length > 5 ? 'completed' : 'in_progress';
        
        return {
          ...s,
          checklist: newChecklist,
          status: s.status === 'completed' && !allDone ? 'in_progress' : s.status
        };
      });
    });
  };

  const handleEvidenceChange = (stepNumber, text) => {
    setStepsData(prev => prev.map(s => s.step === stepNumber ? { ...s, evidenceText: text } : s));
  };

  const handleCompleteStep = (stepNumber) => {
    setStepsData(prev => {
      const updated = prev.map(s => {
        if (s.step === stepNumber) {
          return {
            ...s,
            status: 'completed',
            completedAt: new Date().toISOString(),
            checklist: s.checklist.map(() => true)
          };
        }
        // Unlock next step
        if (s.step === stepNumber + 1 && s.status === 'locked') {
          return {
            ...s,
            status: 'in_progress'
          };
        }
        return s;
      });
      return updated;
    });

    if (stepNumber < 11) {
      setExpandedStep(stepNumber + 1);
    }
  };

  const handleSubmitForReview = () => {
    if (!mandatoryCompleted) return;
    setSubmissionStatus('under_review');
    setSubmissionFeedback('Your startup roadmap has been submitted for platform review. Bidaya administrators will evaluate your deliverables.');
    if (onPublicationStatusChange) {
      onPublicationStatusChange('under_review');
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      
      {/* Top Banner: Readiness Score & Investor Readiness */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-violet-950/70 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 text-blue-300 text-xs font-bold border border-blue-700/60">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Tunisia Startup Roadmap Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Readiness Score: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">{readinessScore}%</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Complete the 11 milestone roadmap to earn verified publication status, unlock investor diligence data rooms, and maximize your Smart Match compatibility.
          </p>
        </div>

        {/* Progress Circular / Bar Indicator */}
        <div className="flex-shrink-0 flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex flex-col items-center justify-center text-white shadow-lg">
            <span className="text-lg font-black">{completedCount}/11</span>
            <span className="text-[9px] uppercase font-bold text-blue-200">Steps</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {mandatoryCompleted ? 'Ready for Publication' : 'In Progress (Milestone 4)'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {mandatoryCompleted 
                ? 'All mandatory MVP steps satisfied' 
                : `${10 - completedCount} mandatory steps remaining`}
            </div>
          </div>
        </div>
      </div>

      {submissionFeedback && (
        <div className="p-4 rounded-2xl bg-blue-950/80 border border-blue-500/40 text-xs text-blue-200 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{submissionFeedback}</span>
        </div>
      )}

      {/* 11 Roadmap Steps List */}
      <div className="space-y-3.5">
        {ROADMAP_STEPS.map((st, idx) => {
          const state = stepsData.find(s => s.step === st.step) || {
            status: idx === 0 ? 'in_progress' : 'locked',
            checklist: st.checklist.map(() => false),
            evidenceText: ''
          };

          const isExpanded = expandedStep === st.step;
          const isCompleted = state.status === 'completed';
          const isLocked = state.status === 'locked';

          return (
            <div
              key={st.step}
              className={`rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-slate-900/60 border-emerald-500/30'
                  : isExpanded
                  ? 'bg-slate-800/90 border-blue-500/60 shadow-lg shadow-blue-500/10'
                  : isLocked
                  ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                  : 'bg-slate-800/50 border-slate-700/60'
              }`}
            >
              {/* Step Header */}
              <div 
                onClick={() => !isLocked && setExpandedStep(isExpanded ? null : st.step)}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-md ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isLocked
                      ? 'bg-slate-800 text-slate-500'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : st.step}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {st.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {st.tag}
                      </span>
                      {st.mandatoryForMvp && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/60 hidden sm:inline">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {st.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : isLocked
                      ? 'bg-slate-800 text-slate-500 border-slate-700'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {state.status.replace('_', ' ')}
                  </span>

                  {!isLocked && (
                    <button className="text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Step Expanded Details */}
              {isExpanded && !isLocked && (
                <div className="p-4 sm:p-6 pt-0 border-t border-slate-700/60 mt-2 space-y-5 text-xs text-slate-300">
                  
                  {/* Checklist */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-200 text-xs block">
                      Milestone Checklist:
                    </span>
                    <div className="space-y-1.5">
                      {st.checklist.map((item, cIdx) => (
                        <label 
                          key={cIdx} 
                          className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(state.checklist[cIdx])}
                            onChange={() => toggleChecklistItem(st.step, cIdx)}
                            className="mt-0.5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={state.checklist[cIdx] ? 'line-through text-slate-400' : 'text-slate-200'}>
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Concrete Deliverables */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-200 text-xs block">
                      Required Concrete Deliverables:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {st.deliverables.map((deliv, dIdx) => (
                        <span key={dIdx} className="px-2.5 py-1 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-800/60 font-medium text-[11px] flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-blue-400" />
                          <span>{deliv}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Input (Upload/Notes) */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-200 text-xs block">
                      Evidence & Deliverable Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={state.evidenceText || ''}
                      onChange={(e) => handleEvidenceChange(st.step, e.target.value)}
                      placeholder="Paste link to Google Drive / Notion / RNE certificate or summarize completion..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                    />
                  </div>

                  {/* Actions: Ask AI for Help & Complete Step */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenAiGuide('startup', st.aiPrompt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-violet-300 bg-violet-950/80 hover:bg-violet-900 border border-violet-700/60 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      <span>Ask AI for Guidance on this Step</span>
                    </button>

                    {st.step === 11 ? (
                      <button
                        type="button"
                        onClick={handleSubmitForReview}
                        disabled={!mandatoryCompleted || submissionStatus === 'under_review'}
                        className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                          mandatoryCompleted && submissionStatus !== 'under_review'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submissionStatus === 'under_review' ? 'Submitted Under Review' : 'Submit Profile for Admin Review'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCompleteStep(st.step)}
                        className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete Milestone & Unlock Next</span>
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
