/**
 * Data Access Layer for Bidaya Tunisia
 * Connected to Django REST Framework backend.
 * Zero Supabase dependencies.
 */

import { api } from '../services/api';

export const mapStartup = (row) => {
  if (!row) return null;
  const fundingNum = row.funding_needed_tnd ?? row.funding_needed ?? 0;
  return {
    ...row,
    id: row.id,
    name: row.name || 'Startup',
    pitch: row.pitch || '',
    sector: row.sector || '',
    stage: row.stage || 'Idea',
    governorate: row.location || row.governorate || 'Tunis',
    location: row.location || row.governorate || 'Tunis',
    fundingNeeded: `${Number(fundingNum).toLocaleString('en-US')} TND`,
    funding_needed_tnd: fundingNum,
    fundingTypeSought: row.funding_type || row.fundingTypeSought || 'Equity',
    legalStatus: row.legal_status || row.legalStatus || 'SARL',
    readinessScore: row.readiness_score ?? row.readinessScore ?? 0,
    aiMatchScore: row.readiness_score ?? row.readinessScore ?? 0,
    publicationStatus: row.publication_status || row.publicationStatus || 'draft',
    investorVisible: row.investor_visible ?? row.investorVisible ?? false,
    ownerId: row.owner_id || row.owner?.id,
    reviewerFeedback: row.reviewer_feedback || '',
  };
};

export const mapInvestor = (row) => {
  if (!row) return null;
  const tMin = row.ticket_min ?? row.ticket_min_tnd ?? 50000;
  const tMax = row.ticket_max ?? row.ticket_max_tnd ?? 500000;
  return {
    ...row,
    id: row.id,
    name: row.company_name || row.organization_name || row.name || 'Investor',
    firm: row.company_name || row.organization_name || row.name || 'Investor',
    organization_name: row.company_name || row.organization_name || row.name,
    type: row.investor_type || row.type || 'Angel Investor',
    focus: row.sectors || row.focus || [],
    sectors: row.sectors || row.focus || [],
    stages: row.investment_stage || row.stages || [],
    governorates: row.preferred_governorates || row.governorates || [],
    investmentTypes: row.investment_types || row.investmentTypes || [],
    ticket_min_tnd: tMin,
    ticket_max_tnd: tMax,
    budgetRange: `${Number(tMin).toLocaleString('en-US')} - ${Number(tMax).toLocaleString('en-US')} TND`,
    verificationStatus: row.verification_status || row.verificationStatus || 'draft',
    ownerId: row.user?.id || row.user || row.owner_id,
  };
};

export async function fetchApprovedStartups() {
  const startups = await api.startups.list({ status: 'approved' });
  return (startups || []).map(mapStartup);
}

export async function fetchStartupById(id) {
  const data = await api.startups.getById(id);
  return mapStartup(data);
}

export async function saveStartupProfile(ownerId, form) {
  const res = await api.startups.saveMe(form);
  return mapStartup(res);
}

export async function fetchOwnStartup() {
  const data = await api.startups.getMe();
  return mapStartup(data);
}

export async function saveInvestorProfile(ownerId, form) {
  const res = await api.investors.saveProfile(form);
  return mapInvestor(res);
}

export async function fetchOwnInvestor() {
  const data = await api.investors.getProfile();
  return mapInvestor(data);
}

export async function fetchApprovedInvestors() {
  const investors = await api.investors.list();
  return (investors || []).map(mapInvestor);
}

export async function fetchStartupProgress(startupId) {
  const steps = await api.startups.getProgress(startupId);
  return steps || [];
}

export async function fetchInterests(filters = {}) {
  const interests = await api.startups.getInterests();
  return interests || [];
}

export async function createInterest(startupId, investorId) {
  return await api.startups.createInterest(startupId, investorId);
}

export async function fetchMeetings(filters = {}) {
  const meetings = await api.startups.getMeetings();
  return (meetings || []).map((row) => ({
    ...row,
    startupId: row.startup,
    investorId: row.investor,
    startupName: row.startup_name || 'Startup',
    investorName: row.investor_name || 'Investor',
    requestedBy: row.requested_by,
    scheduledAt: row.scheduled_at,
    durationMinutes: row.duration_minutes,
    roomId: row.room_id,
    outcomeStatus: row.outcome_status,
  }));
}

export async function fetchMeetingById(id) {
  const meetings = await fetchMeetings();
  return meetings.find((m) => m.id === id) || null;
}

export async function updateMeeting(id, updates) {
  return await api.startups.updateMeeting(id, updates);
}

export async function createMeetingRequest({ startupId, investorId, requestedBy, scheduledAt, durationMinutes, agenda }) {
  return await api.startups.createMeeting({
    startup: startupId,
    investor: investorId,
    requested_by: requestedBy,
    scheduled_at: scheduledAt,
    duration_minutes: Number(durationMinutes),
    agenda,
  });
}

export async function fetchAdminData() {
  const data = await api.admin.getDashboard();
  return {
    profiles: (data.profiles || []).map((row) => ({
      ...row,
      name: row.full_name || row.name || row.email,
      joined: row.joined,
      org: '',
    })),
    startups: (data.startups || []).map(mapStartup),
    investors: (data.investors || []).map(mapInvestor),
    meetings: data.meetings || [],
    interests: data.interests || [],
    logs: data.logs || [],
  };
}

export async function updateStartupReview(id, publicationStatus, reviewerFeedback = '') {
  return await api.startups.review(id, {
    publication_status: publicationStatus,
    reviewer_feedback: reviewerFeedback,
    investor_visible: publicationStatus === 'approved'
  });
}

export async function updateInvestorReview(id, verificationStatus, verificationNotes = '') {
  return await api.investors.verify(id, {
    verification_status: verificationStatus,
    verification_notes: verificationNotes
  });
}
