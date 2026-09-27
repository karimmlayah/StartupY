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
    <div className="bg-surface-elevated rounded-xl border border-sand shadow-md overflow-hidden">
      
      {/* Notification */}
      {notification && (
        <div className="px-6 pt-4">
          <div className="p-3 rounded-xl bg-success-bg/15 border border-success/30 text-success text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification('')} className="text-success hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex items-center justify-between cursor-pointer hover:bg-surface/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isPrivate 
              ? 'bg-coral border border-sand/50'
              : 'bg-coral border border-success/30'
          }`}>
            {isPrivate ? (
              <EyeOff className="w-6 h-6 text-muted" />
            ) : (
              <Eye className="w-6 h-6 text-success" />
            )}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Investor Visibility
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                {style.icon} {STATUS_LABELS[status]}
              </span>
            </h3>
            <p className="text-xs text-muted mt-0.5">
              {isPrivate
                ? 'Your startup is currently private. Only you can see it.'
                : 'Your startup is visible to verified investors on Bidaya.'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-6 space-y-5">
          
          {/* Current Status Explanation */}
          <div className={`p-4 rounded-xl border ${style.bg} ${style.border}`}>
            <div className="flex items-start gap-3">
              {status === 'draft' && <Lock className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />}
              {status === 'building' && <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />}
              {status === 'investor_ready' && <Shield className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />}
              {status === 'under_review' && <FileText className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />}
              {status === 'approved' && <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />}
              {status === 'changes_requested' && <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />}
              {status === 'rejected' && <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />}
              {status === 'suspended' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
              
              <div className="text-xs leading-relaxed">
                {status === 'draft' && (
                  <span className="text-brown-mid">Your startup is in <strong>Draft</strong> mode. Only you can see it. No investor, admin, or search engine has access to your data. Take your time to build your profile and complete the roadmap.</span>
                )}
                {status === 'building' && (
                  <span className="text-warning">Your startup is in <strong>Building</strong> mode. You're actively working on your profile. Still completely private from investors.</span>
                )}
                {status === 'investor_ready' && (
                  <span className="text-coral">You've marked your startup as <strong>Investor Ready</strong>. Complete the readiness checklist below to request visibility.</span>
                )}
                {status === 'under_review' && (
                  <span className="text-coral"><strong>Your startup remains private until approved.</strong> An admin is reviewing your submission. You'll be notified when a decision is made.</span>
                )}
                {status === 'approved' && (
                  <span className="text-success">Your startup is <strong>Approved</strong> and visible to verified investors on Bidaya. Sensitive documents (financials, cap table, data room) remain private until you explicitly grant access.</span>
                )}
                {status === 'changes_requested' && (
                  <span className="text-warning">An admin has requested changes to your profile. Review the notes below and resubmit when ready.</span>
                )}
                {status === 'rejected' && (
                  <span className="text-danger">Your submission was not approved. You may revise your profile and resubmit.</span>
                )}
                {status === 'suspended' && (
                  <span className="text-red-200">Your startup has been suspended by an administrator. Your access is limited.</span>
                )}
              </div>
            </div>
            
            {pubState.admin_review_notes && ['changes_requested', 'rejected'].includes(status) && (
              <div className="mt-3 p-3 rounded-lg bg-surface-elevated/50 border border-sand text-xs text-brown-mid">
                <strong className="text-brown-mid">Admin Notes:</strong> {pubState.admin_review_notes}
              </div>
            )}
          </div>

          {/* Manual Status Progression (for drafts) */}
          {['draft', 'building', 'investor_ready'].includes(status) && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-brown-mid uppercase tracking-wider">
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
                          ? `${st.bg} ${st.text} ${st.border} ring-2 ring-offset-1 ring-offset-surface-elevated`
                          : 'bg-surface text-muted border-sand hover:border-sand'
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
                <label className="text-xs font-bold text-brown-mid uppercase tracking-wider">
                  Readiness Checklist for Investor Visibility
                </label>
                <span className="text-xs text-taupe">
                  {readinessCheck.completedCount} / {readinessCheck.totalCount} complete
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    readinessCheck.allCompleted
                      ? 'bg-success-bg'
                      : 'bg-coral'
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
                        ? 'bg-success-bg/10 border-success/30'
                        : 'bg-surface border-sand'
                    }`}
                  >
                    {gate.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-taupe flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <span className={`text-xs font-semibold ${gate.completed ? 'text-success' : 'text-brown-mid'}`}>
                        {gate.label}
                      </span>
                      <span className="text-[10px] text-taupe ml-2">
                        Roadmap Step {gate.roadmapStep}
                      </span>
                    </div>
                    {gate.completed ? (
                      <span className="text-[10px] font-bold text-success">Done</span>
                    ) : (
                      <span className="text-[10px] font-bold text-taupe">Pending</span>
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
                className={`w-full py-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  canRequest
                    ? 'bg-coral text-white shadow-md cursor-pointer hover:scale-[1.01]'
                    : 'bg-surface text-taupe border border-sand cursor-not-allowed'
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
                <p className="text-[11px] text-taupe text-center">
                  Complete all {readinessCheck?.totalCount} roadmap items above to unlock this action.
                </p>
              )}
            </div>
          )}

          {/* Sensitive Data Notice (for approved startups) */}
          {status === 'approved' && (
            <div className="p-4 rounded-xl bg-coral/10 border border-coral/40 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-coral" />
                <span className="text-xs font-bold text-coral">Sensitive Content Protected</span>
              </div>
              <p className="text-xs text-coral leading-relaxed">
                Even though your startup is visible, the following remain private until you explicitly grant access to a specific investor:
              </p>
              <ul className="text-xs text-coral space-y-1 ml-4">
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-coral" /> Legal documents
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-coral" /> Financial projections
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-coral" /> Cap table
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-coral" /> Data room
                </li>
              </ul>
            </div>
          )}

        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cream backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-elevated border border-sand rounded-xl p-6 shadow-sm space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-lg bg-coral-dark/20 border border-coral/40 flex items-center justify-center mx-auto">
                <Send className="w-7 h-7 text-coral" />
              </div>
              <h3 className="text-xl font-bold text-white">Request Investor Visibility</h3>
              <p className="text-sm text-brown-mid">
                Your startup will be submitted for admin review. It remains completely private until approved.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-coral/10 border border-coral/40 text-xs text-coral flex items-start gap-2">
              <Info className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
              <span>
                Once approved, your public profile will be visible to verified investors. Sensitive documents will still require your explicit permission.
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-xs text-brown-mid bg-surface hover:bg-sand border border-sand transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestVisibility}
                className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-coral shadow-sm transition-all cursor-pointer"
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
