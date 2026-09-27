/**
 * Bidaya Tunisia - Admin Management & Audit Log Utilities
 */

import { INITIAL_STARTUPS } from '../data/mockStartups';
import { INITIAL_INVESTORS } from '../data/mockInvestors';
import { getAllMeetings } from './meetingStorage';

const STORAGE_KEYS = {
  ADMIN_STARTUPS: 'bidaya_admin_startups_status',
  ADMIN_INVESTORS: 'bidaya_admin_investors_status',
  AUDIT_LOGS: 'bidaya_admin_audit_logs',
  ALL_USERS: 'bidaya_admin_all_users'
};

const INITIAL_AUDIT_LOGS = [
  {
    id: 'log_01',
    actorName: 'Admin (Direction Générale)',
    action: 'STARTUP_APPROVED',
    entityType: 'startup',
    entityName: 'AgriSmart Tunisia',
    metadata: { governorate: 'Sfax', ticket: '450,000 TND', decision: 'Meets Startup Act criteria' },
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'log_02',
    actorName: 'Admin (Direction Générale)',
    action: 'INVESTOR_VERIFICATION_SUBMITTED',
    entityType: 'investor',
    entityName: 'Carthage Angels Network',
    metadata: { mandate: 'Angel Syndicate', status: 'under_review' },
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: 'log_03',
    actorName: 'Admin (Direction Générale)',
    action: 'MEETING_SCHEDULED',
    entityType: 'meeting',
    entityName: 'AgriSmart ↔ Carthage Angels',
    metadata: { duration: '45 min', room: 'bidaya_meeting_agrismart_carthage_seed' },
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 'log_04',
    actorName: 'System',
    action: 'NEW_USER_REGISTERED',
    entityType: 'profile',
    entityName: 'DinarPay Solutions Team',
    metadata: { role: 'startup', governorate: 'Tunis' },
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

const INITIAL_ADMIN_STARTUPS = INITIAL_STARTUPS.map((s, idx) => ({
  ...s,
  publicationStatus: idx === 0 ? 'approved' : idx === 1 ? 'under_review' : idx === 2 ? 'approved' : 'draft',
  readinessScore: idx === 0 ? 92 : idx === 1 ? 78 : 65,
  reviewerNote: idx === 0 ? 'Verified RNE and IoT validation.' : idx === 1 ? 'Pending Startup Act Label validation.' : 'Drafting MVP roadmap.',
  feedbackToFounder: idx === 0 ? 'Your profile is approved and visible to accredited Tunisian investors.' : 'Under administrative review by the StartupY team.'
}));

const INITIAL_ADMIN_INVESTORS = INITIAL_INVESTORS.map((inv, idx) => ({
  ...inv,
  verificationStatus: idx === 0 ? 'approved' : idx === 1 ? 'under_review' : idx === 2 ? 'documents_required' : 'approved',
  reviewerNote: idx === 0 ? 'Accredited angel network in Tunis.' : idx === 1 ? 'Verifying syndicate constitution agreement.' : 'RNE extract expired, please upload 2026 update.',
  documents: [
    { type: 'Identity (CIN/Passport)', url: 'cin_sample.pdf', verified: true },
    { type: 'RNE Commercial Register', url: 'rne_extract_sample.pdf', verified: idx !== 2 },
    { type: 'Investment Mandate Memo', url: 'mandate_agreement.pdf', verified: true }
  ]
}));

export function getAdminStartups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_STARTUPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_STARTUPS, JSON.stringify(INITIAL_ADMIN_STARTUPS));
      return INITIAL_ADMIN_STARTUPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ADMIN_STARTUPS;
  }
}

export function updateStartupAdminStatus(startupId, publicationStatus, reviewerNote, feedbackToFounder) {
  const current = getAdminStartups();
  let targetStartupName = startupId;
  const updated = current.map(s => {
    if (s.id === startupId) {
      targetStartupName = s.name;
      return {
        ...s,
        publicationStatus,
        reviewerNote: reviewerNote || s.reviewerNote,
        feedbackToFounder: feedbackToFounder || s.feedbackToFounder,
        updatedAt: new Date().toISOString()
      };
    }
    return s;
  });

  localStorage.setItem(STORAGE_KEYS.ADMIN_STARTUPS, JSON.stringify(updated));

  // Log action in audit_logs
  recordAuditLog({
    action: `STARTUP_${publicationStatus.toUpperCase()}`,
    entityType: 'startup',
    entityName: targetStartupName,
    metadata: { decision: publicationStatus, internalNote: reviewerNote }
  });

  return updated;
}

export function getAdminInvestors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_INVESTORS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_INVESTORS, JSON.stringify(INITIAL_ADMIN_INVESTORS));
      return INITIAL_ADMIN_INVESTORS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ADMIN_INVESTORS;
  }
}

export function updateInvestorAdminStatus(investorId, verificationStatus, reviewerNote) {
  const current = getAdminInvestors();
  let targetInvestorName = investorId;
  const updated = current.map(inv => {
    if (inv.id === investorId) {
      targetInvestorName = inv.name;
      return {
        ...inv,
        verificationStatus,
        reviewerNote: reviewerNote || inv.reviewerNote,
        updatedAt: new Date().toISOString()
      };
    }
    return inv;
  });

  localStorage.setItem(STORAGE_KEYS.ADMIN_INVESTORS, JSON.stringify(updated));

  // Log action in audit_logs
  recordAuditLog({
    action: `INVESTOR_${verificationStatus.toUpperCase()}`,
    entityType: 'investor',
    entityName: targetInvestorName,
    metadata: { status: verificationStatus, reviewerNote }
  });

  return updated;
}

export function getAuditLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
}

export function recordAuditLog({ action, entityType, entityName, metadata = {} }) {
  const current = getAuditLogs();
  const newLog = {
    id: `log_${Date.now()}`,
    actorName: 'Admin (Direction Générale)',
    action,
    entityType,
    entityName,
    metadata,
    createdAt: new Date().toISOString()
  };
  const updated = [newLog, ...current];
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  return updated;
}

export function getPlatformUsers() {
  return [
    { id: 'usr_01', name: 'Yassine Karray', email: 'founder@agrismart.tn', role: 'startup', org: 'AgriSmart Tunisia', governorate: 'Sfax', joined: '2026-09-15' },
    { id: 'usr_02', name: 'Sami Ben Amor', email: 'investor@carthageangels.tn', role: 'investor', org: 'Carthage Angels', governorate: 'Tunis', joined: '2026-09-12' },
    { id: 'usr_03', name: 'Tarek Ben Youssef', email: 'tarek@dinarpay.tn', role: 'startup', org: 'DinarPay Solutions', governorate: 'Tunis', joined: '2026-09-18' },
    { id: 'usr_04', name: 'Leila Trabelsi', email: 'leila@jasminecapital.tn', role: 'investor', org: 'Jasmine Capital', governorate: 'Tunis', joined: '2026-09-10' },
    { id: 'usr_05', name: 'Khadija Mansour', email: 'khadija@soukcraft.tn', role: 'startup', org: 'SoukCraft Tunisia', governorate: 'Nabeul', joined: '2026-09-20' },
    { id: 'usr_06', name: 'Mehdi Charfi', email: 'diaspora@venture.tn', role: 'investor', org: 'Tunisian Diaspora Syndicate', governorate: 'Tunis / Paris', joined: '2026-09-08' },
    { id: 'usr_admin', name: 'StartupY Platform Administrator', email: 'admin@bidaya.tn', role: 'admin', org: 'Direction Générale StartupY', governorate: 'Tunis', joined: '2026-09-01' }
  ];
}
