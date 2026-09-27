import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  X,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  PUBLICATION_STATUSES,
  STATUS_LABELS,
  STATUS_STYLES,
  READINESS_GATES,
  checkReadinessGates,
  getPublicationState,
  savePublicationState,
  requestInvestorVisibility,
} from '../utils/publicationStatus';

const ROADMAP_STORAGE_KEY = 'bidaya_tunisia_startup_roadmap';

export default function PublicationStatusPanel({ startupId, onStatusChange }) {
  const [pubState, setPubState] = useState(null);
  const [readinessCheck, setReadinessCheck] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const state = getPublicationState(startupId);
    setPubState(state);

    // Load roadmap progress to check readiness gates
    try {
      const raw = localStorage.getItem(ROADMAP_STORAGE_KEY);
      const progress = raw ? JSON.parse(raw) : {};
      setReadinessCheck(checkReadinessGates(progress));
    } catch {
      setReadinessCheck(checkReadinessGates({}));
    }
  }, [startupId]);

  if (!pubState) return null;

  const status = pubState.publication_status || 'draft';
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft;
  const isPrivate = ['draft', 'building', 'investor_ready', 'under_review', 'changes_requested', 'rejected'].includes(status);
  const canRequest = readinessCheck?.allCompleted && ['draft', 'building', 'investor_ready', 'changes_requested'].includes(status);

  const handleRequestVisibility = () => {
    requestInvestorVisibility(startupId);
    const updated = getPublicationState(startupId);
    setPubState(updated);
    setShowConfirmModal(false);
    setNotification('Publication request submitted. Your startup remains private until an admin approves it.');
    setTimeout(() => setNotification(''), 6000);
    if (onStatusChange) onStatusChange(updated);
  };

  const handleStatusUpdate = (newStatus) => {
    savePublicationState(startupId, {
      ...pubState,
      publication_status: newStatus,
    });
    const updated = getPublicationState(startupId);
    setPubState(updated);
    if (onStatusChange) onStatusChange(updated);
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      
      {/* Notification */}
      {notification && (
        <div className="px-6 pt-4">
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification('')} className="text-emerald-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isPrivate 
              ? 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50' 
              : 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30'
          }`}>
            {isPrivate ? (
              <EyeOff className="w-6 h-6 text-slate-400" />
            ) : (
              <Eye className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Investor Visibility
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                {style.icon} {STATUS_LABELS[status]}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPrivate
                ? 'Your startup is currently private. Only you can see it.'
                : 'Your startup is visible to verified investors on Bidaya.'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
          
          {/* Current Status Explanation */}
          <div className={`p-4 rounded-xl border ${style.bg} ${style.border}`}>
            <div className="flex items-start gap-3">
              {status === 'draft' && <Lock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />}
              {status === 'building' && <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />}
              {status === 'investor_ready' && <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />}
              {status === 'under_review' && <FileText className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />}
              {status === 'approved' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
              {status === 'changes_requested' && <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />}
              {status === 'rejected' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />}
              {status === 'suspended' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
              
              <div className="text-xs leading-relaxed">
                {status === 'draft' && (
                  <span className="text-slate-300">Your startup is in <strong>Draft</strong> mode. Only you can see it. No investor, admin, or search engine has access to your data. Take your time to build your profile and complete the roadmap.</span>
                )}
                {status === 'building' && (
                  <span className="text-amber-200">Your startup is in <strong>Building</strong> mode. You're actively working on your profile. Still completely private from investors.</span>
                )}
                {status === 'investor_ready' && (
                  <span className="text-blue-200">You've marked your startup as <strong>Investor Ready</strong>. Complete the readiness checklist below to request visibility.</span>
                )}
                {status === 'under_review' && (
                  <span className="text-violet-200"><strong>Your startup remains private until approved.</strong> An admin is reviewing your submission. You'll be notified when a decision is made.</span>
                )}
                {status === 'approved' && (
                  <span className="text-emerald-200">Your startup is <strong>Approved</strong> and visible to verified investors on Bidaya. Sensitive documents (financials, cap table, data room) remain private until you explicitly grant access.</span>
                )}
                {status === 'changes_requested' && (
                  <span className="text-orange-200">An admin has requested changes to your profile. Review the notes below and resubmit when ready.</span>
                )}
                {status === 'rejected' && (
                  <span className="text-rose-200">Your submission was not approved. You may revise your profile and resubmit.</span>
                )}
                {status === 'suspended' && (
                  <span className="text-red-200">Your startup has been suspended by an administrator. Your access is limited.</span>
                )}
              </div>
            </div>
            
            {pubState.admin_review_notes && ['changes_requested', 'rejected'].includes(status) && (
              <div className="mt-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-xs text-slate-300">
                <strong className="text-slate-200">Admin Notes:</strong> {pubState.admin_review_notes}
              </div>
            )}
          </div>

          {/* Manual Status Progression (for drafts) */}
          {['draft', 'building', 'investor_ready'].includes(status) && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Update Your Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['draft', 'building', 'investor_ready'].map((s) => {
                  const st = STATUS_STYLES[s];
                  const isActive = status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isActive
                          ? `${st.bg} ${st.text} ${st.border} ring-2 ring-offset-1 ring-offset-slate-900`
                          : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {st.icon} {STATUS_LABELS[s]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Readiness Gates Checklist */}
          {['draft', 'building', 'investor_ready', 'changes_requested'].includes(status) && readinessCheck && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Readiness Checklist for Investor Visibility
                </label>
                <span className="text-xs text-slate-500">
                  {readinessCheck.completedCount} / {readinessCheck.totalCount} complete
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    readinessCheck.allCompleted
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-blue-500 to-violet-500'
                  }`}
                  style={{ width: `${(readinessCheck.completedCount / readinessCheck.totalCount) * 100}%` }}
                />
              </div>

              <div className="space-y-2">
                {readinessCheck.gates.map((gate) => (
                  <div
                    key={gate.key}
                    className={`p-3 rounded-xl border flex items-center gap-3 ${
                      gate.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    {gate.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <span className={`text-xs font-semibold ${gate.completed ? 'text-emerald-300' : 'text-slate-300'}`}>
                        {gate.label}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-2">
                        Roadmap Step {gate.roadmapStep}
                      </span>
                    </div>
                    {gate.completed ? (
                      <span className="text-[10px] font-bold text-emerald-400">Done</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Investor Visibility Button */}
          {['draft', 'building', 'investor_ready', 'changes_requested'].includes(status) && (
            <div className="space-y-2">
              <button
                onClick={() => canRequest ? setShowConfirmModal(true) : null}
                disabled={!canRequest}
                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  canRequest
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-violet-500 cursor-pointer hover:scale-[1.01]'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                {canRequest ? (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Request Investor Visibility</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Complete All Readiness Items to Request Visibility</span>
                  </>
                )}
              </button>
              {!canRequest && (
                <p className="text-[11px] text-slate-500 text-center">
                  Complete all {readinessCheck?.totalCount} roadmap items above to unlock this action.
                </p>
              )}
            </div>
          )}

          {/* Sensitive Data Notice (for approved startups) */}
          {status === 'approved' && (
            <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-300">Sensitive Content Protected</span>
              </div>
              <p className="text-xs text-blue-200 leading-relaxed">
                Even though your startup is visible, the following remain private until you explicitly grant access to a specific investor:
              </p>
              <ul className="text-xs text-blue-300 space-y-1 ml-4">
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-blue-400" /> Legal documents
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-blue-400" /> Financial projections
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-blue-400" /> Cap table
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-blue-400" /> Data room
                </li>
              </ul>
            </div>
          )}

        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto">
                <Send className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Request Investor Visibility</h3>
              <p className="text-sm text-slate-300">
                Your startup will be submitted for admin review. It remains completely private until approved.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                Once approved, your public profile will be visible to verified investors. Sensitive documents will still require your explicit permission.
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestVisibility}
                className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg transition-all cursor-pointer"
              >
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
