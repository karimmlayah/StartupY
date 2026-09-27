import React, { useState, useEffect } from 'react';
import { 
  Award,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Upload,
  Shield,
  Info,
  ExternalLink
} from 'lucide-react';
import {
  STARTUP_ACT_STATUSES,
  STARTUP_ACT_LABELS,
  STARTUP_ACT_STYLES,
} from '../utils/publicationStatus';

const SA_STORAGE_KEY = 'bidaya_startup_act_module';

const STARTUP_ACT_STEPS = [
  {
    id: 'eligibility',
    title: 'Check Eligibility',
    description: 'Verify that your startup meets the criteria for the Startup Act label: less than 8 years old, fewer than 100 employees, and an innovative business model.',
  },
  {
    id: 'documents',
    title: 'Prepare Documents',
    description: 'Gather required documents: business plan, financial projections, proof of innovation, team CVs, and legal registration papers.',
  },
  {
    id: 'application',
    title: 'Submit Application',
    description: 'Submit your application through the official portal or through a certified incubator.',
  },
  {
    id: 'review',
    title: 'Commission Review',
    description: 'The labeling commission reviews your application. This typically takes 20 working days.',
  },
  {
    id: 'label',
    title: 'Label Decision',
    description: 'Receive the official decision. If approved, you gain access to Startup Act benefits including tax exemptions, salary support, and more.',
  },
];

export default function StartupActModule() {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(STARTUP_ACT_STATUSES.NOT_STARTED);
  const [checkedSteps, setCheckedSteps] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.status) setStatus(parsed.status);
        if (parsed.checkedSteps) setCheckedSteps(parsed.checkedSteps);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveState = (newStatus, newChecked) => {
    try {
      localStorage.setItem(SA_STORAGE_KEY, JSON.stringify({
        status: newStatus || status,
        checkedSteps: newChecked || checkedSteps,
      }));
    } catch (e) {
      // ignore
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    saveState(newStatus, checkedSteps);
  };

  const handleToggleStep = (stepId) => {
    const updated = { ...checkedSteps, [stepId]: !checkedSteps[stepId] };
    setCheckedSteps(updated);
    saveState(status, updated);
  };

  const style = STARTUP_ACT_STYLES[status] || STARTUP_ACT_STYLES.not_started;
  const completedSteps = Object.values(checkedSteps).filter(Boolean).length;

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Startup Act Label</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                Optional Module
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Track your progress toward the Tunisian Startup Act label and its benefits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
            {STARTUP_ACT_LABELS[status]}
          </span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-6 space-y-5">
          
          {/* Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200 leading-relaxed">
              <strong>Bidaya provides indicative guidance only.</strong> Official decisions regarding the Startup Act label belong to the relevant authority (Ministry of Communication Technologies and Digital Economy). Never claim official label status unless verified.
            </p>
          </div>

          {/* Status Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Your Startup Act Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(STARTUP_ACT_STATUSES).map(([key, value]) => {
                const s = STARTUP_ACT_STYLES[value];
                const isActive = status === value;
                return (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(value)}
                    className={`p-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isActive
                        ? `${s.bg} ${s.text} ${s.border} ring-2 ring-offset-1 ring-offset-slate-900 ${s.border}`
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {STARTUP_ACT_LABELS[value]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Application Checklist
              </label>
              <span className="text-xs text-slate-500">
                {completedSteps} / {STARTUP_ACT_STEPS.length} steps
              </span>
            </div>
            
            {STARTUP_ACT_STEPS.map((step) => (
              <div
                key={step.id}
                onClick={() => handleToggleStep(step.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  checkedSteps[step.id]
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  {checkedSteps[step.id] ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-semibold ${checkedSteps[step.id] ? 'text-emerald-300' : 'text-white'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Evidence Upload Notice */}
          {status === STARTUP_ACT_STATUSES.LABEL_OBTAINED && (
            <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-300">Verification Required</span>
              </div>
              <p className="text-xs text-blue-200 leading-relaxed">
                To display the Startup Act label on your profile, please submit proof of labeling. An admin will verify before the badge is shown publicly.
              </p>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Label Certificate</span>
              </button>
            </div>
          )}

          {/* Info Link */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5" />
            <span>The Startup Act does not affect investor visibility on Bidaya. You can request investor access independently.</span>
          </div>

        </div>
      )}
    </div>
  );
}
