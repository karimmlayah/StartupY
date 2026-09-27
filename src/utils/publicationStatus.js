/**
 * Startup Publication Status System
 * 
 * Defines privacy statuses, visibility rules, and readiness gates
 * for controlling when startups become visible to investors.
 */

// All valid publication statuses
export const PUBLICATION_STATUSES = {
  DRAFT: 'draft',
  BUILDING: 'building',
  INVESTOR_READY: 'investor_ready',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  CHANGES_REQUESTED: 'changes_requested',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

// Human-readable labels
export const STATUS_LABELS = {
  draft: 'Draft',
  building: 'Building',
  investor_ready: 'Investor Ready',
  under_review: 'Under Review',
  approved: 'Approved',
  changes_requested: 'Changes Requested',
  rejected: 'Rejected',
  suspended: 'Suspended',
};

// Status badge styling
export const STATUS_STYLES = {
  draft: {
    bg: 'bg-slate-500/15',
    text: 'text-slate-400',
    border: 'border-slate-600/40',
    dot: 'bg-slate-400',
    icon: '📝',
  },
  building: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-600/40',
    dot: 'bg-amber-400',
    icon: '🔨',
  },
  investor_ready: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-600/40',
    dot: 'bg-blue-400',
    icon: '🎯',
  },
  under_review: {
    bg: 'bg-violet-500/15',
    text: 'text-violet-400',
    border: 'border-violet-600/40',
    dot: 'bg-violet-400',
    icon: '🔍',
  },
  approved: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-600/40',
    dot: 'bg-emerald-400',
    icon: '✅',
  },
  changes_requested: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-600/40',
    dot: 'bg-orange-400',
    icon: '🔄',
  },
  rejected: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-600/40',
    dot: 'bg-rose-400',
    icon: '❌',
  },
  suspended: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-600/40',
    dot: 'bg-red-400',
    icon: '🚫',
  },
};

/**
 * Visibility rules: who can see a startup at each status
 */
export const VISIBILITY_RULES = {
  draft: ['founder', 'admin'],
  building: ['founder', 'admin'],
  investor_ready: ['founder', 'admin'],
  under_review: ['founder', 'admin'],
  approved: ['founder', 'admin', 'verified_investor'],
  changes_requested: ['founder', 'admin'],
  rejected: ['founder', 'admin'],
  suspended: ['admin'], // founder has limited access
};

/**
 * Check if a given viewer can see a startup
 */
export function canViewStartup(startup, viewerRole, isVerifiedInvestor = false, isFounder = false) {
  const status = startup?.publication_status || 'draft';
  
  // Founder can always see their own startup (except suspended has limited info)
  if (isFounder) return true;
  
  // Admin can see all startups
  if (viewerRole === 'admin') return true;
  
  // Investors can only see approved startups, and only if verified
  if (viewerRole === 'investor') {
    return status === PUBLICATION_STATUSES.APPROVED && isVerifiedInvestor;
  }
  
  return false;
}

/**
 * Sensitive fields that require explicit founder permission
 * even for approved startups visible to investors
 */
export const SENSITIVE_FIELDS = [
  'legal_documents',
  'financial_projections',
  'cap_table',
  'data_room',
];

/**
 * Readiness gates that must be completed before requesting investor visibility
 */
export const READINESS_GATES = [
  { key: 'problem_customer', label: 'Problem & Target Customer', roadmapStep: 2 },
  { key: 'market_validation', label: 'Market Validation', roadmapStep: 3 },
  { key: 'mvp_solution', label: 'MVP / Solution', roadmapStep: 4 },
  { key: 'business_model', label: 'Business Model', roadmapStep: 5 },
  { key: 'founder_profile', label: 'Founder Profile', roadmapStep: 1 },
  { key: 'funding_request', label: 'Funding Request', roadmapStep: 8 },
  { key: 'pitch_information', label: 'Basic Pitch Information', roadmapStep: 9 },
];

/**
 * Check if all readiness gates are completed based on roadmap progress
 */
export function checkReadinessGates(roadmapProgress = {}) {
  const results = READINESS_GATES.map(gate => {
    const stepKey = `step_${gate.roadmapStep}`;
    const stepData = roadmapProgress[stepKey];
    const isComplete = stepData?.status === 'completed' || stepData?.status === 'complete';
    return {
      ...gate,
      completed: isComplete,
    };
  });

  return {
    gates: results,
    allCompleted: results.every(g => g.completed),
    completedCount: results.filter(g => g.completed).length,
    totalCount: results.length,
  };
}

/**
 * Startup Act module statuses (separate from publication)
 */
export const STARTUP_ACT_STATUSES = {
  NOT_STARTED: 'not_started',
  PREPARING: 'preparing',
  SUBMITTED: 'submitted',
  LABEL_OBTAINED: 'label_obtained',
};

export const STARTUP_ACT_LABELS = {
  not_started: 'Not Started',
  preparing: 'Preparing',
  submitted: 'Submitted',
  label_obtained: 'Label Obtained',
};

export const STARTUP_ACT_STYLES = {
  not_started: { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' },
  preparing: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-600/40' },
  submitted: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-600/40' },
  label_obtained: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-600/40' },
};

/**
 * Default startup publication state for newly created startups
 */
export function getDefaultPublicationState() {
  return {
    publication_status: PUBLICATION_STATUSES.DRAFT,
    startup_act_status: STARTUP_ACT_STATUSES.NOT_STARTED,
    startup_act_evidence: null,
    startup_act_admin_verified: false,
    publication_requested_at: null,
    publication_approved_at: null,
    admin_review_notes: '',
    sensitive_access_granted: {}, // { investorId: ['financial_projections', 'cap_table'] }
  };
}

// Storage key
const PUB_STATUS_KEY = 'bidaya_startup_publication_status';

/**
 * Get the publication state for a startup from localStorage
 */
export function getPublicationState(startupId) {
  try {
    const raw = localStorage.getItem(PUB_STATUS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[startupId] || getDefaultPublicationState();
  } catch {
    return getDefaultPublicationState();
  }
}

/**
 * Save publication state for a startup
 */
export function savePublicationState(startupId, state) {
  try {
    const raw = localStorage.getItem(PUB_STATUS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[startupId] = { ...getDefaultPublicationState(), ...state };
    localStorage.setItem(PUB_STATUS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving publication state:', e);
  }
}

/**
 * Request investor visibility (status → under_review)
 */
export function requestInvestorVisibility(startupId) {
  const state = getPublicationState(startupId);
  savePublicationState(startupId, {
    ...state,
    publication_status: PUBLICATION_STATUSES.UNDER_REVIEW,
    publication_requested_at: new Date().toISOString(),
  });
}

/**
 * Admin approves a startup for investor visibility
 */
export function approveStartup(startupId, adminNotes = '') {
  const state = getPublicationState(startupId);
  savePublicationState(startupId, {
    ...state,
    publication_status: PUBLICATION_STATUSES.APPROVED,
    publication_approved_at: new Date().toISOString(),
    admin_review_notes: adminNotes,
  });
}

/**
 * Admin requests changes
 */
export function requestChanges(startupId, adminNotes = '') {
  const state = getPublicationState(startupId);
  savePublicationState(startupId, {
    ...state,
    publication_status: PUBLICATION_STATUSES.CHANGES_REQUESTED,
    admin_review_notes: adminNotes,
  });
}
