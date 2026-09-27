/**
 * Bidaya Tunisia - Meeting Data Storage & Utilities
 * Provides localStorage persistence and mock Tunisian demo meetings.
 */

const MEETINGS_STORAGE_KEY = 'bidaya_tunisia_meetings';

// Initial realistic fictional demo meetings in Tunisia
const INITIAL_MEETINGS = [
  {
    id: 'meeting_agrismart_carthage_seed',
    startupId: 'agrismart-tunisia',
    startupName: 'AgriSmart Tunisia',
    investorId: 'inv-1',
    investorName: 'Carthage Angels Network',
    requestedBy: 'investor',
    scheduledAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now (ready to join)
    durationMinutes: 45,
    status: 'accepted',
    roomId: 'bidaya_meeting_agrismart_carthage_seed',
    agenda: 'Seed Round Due Diligence & IoT Sensor Unit Economics discussion for Sfax olive groves deployment (450,000 TND).',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    outcomeStatus: null
  },
  {
    id: 'meeting_dinarpay_jasmine_series_a',
    startupId: 'dinarpay-solutions',
    startupName: 'DinarPay Solutions',
    investorId: 'inv-2',
    investorName: 'Jasmine Capital Partners',
    requestedBy: 'investor',
    scheduledAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // Tomorrow
    durationMinutes: 30,
    status: 'requested',
    roomId: 'bidaya_meeting_dinarpay_jasmine_series_a',
    agenda: 'B2B Payment Gateway Expansion & Central Bank of Tunisia compliance review for 800,000 TND equity ticket.',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    outcomeStatus: null
  },
  {
    id: 'meeting_soukcraft_diaspora_intro',
    startupId: 'soukcraft-tunisia',
    startupName: 'SoukCraft Tunisia',
    investorId: 'inv-4',
    investorName: 'Tunisian Diaspora Venture Syndicate',
    requestedBy: 'startup',
    scheduledAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
    durationMinutes: 30,
    status: 'completed',
    roomId: 'bidaya_meeting_soukcraft_diaspora_intro',
    agenda: 'Cross-border artisanal e-commerce exports to Europe and Gulf region. Logistics partnership terms.',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    outcomeStatus: 'Interested'
  }
];

/**
 * Generate a safe room ID compliant with ZEGOCLOUD:
 * bidaya_meeting_<meetingId> with only letters, numbers, and underscores.
 */
export function generateSafeRoomId(meetingId) {
  const sanitizedId = String(meetingId).replace(/[^a-zA-Z0-9_]/g, '_');
  return `bidaya_meeting_${sanitizedId}`;
}

export function getAllMeetings() {
  try {
    const raw = localStorage.getItem(MEETINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(INITIAL_MEETINGS));
      return INITIAL_MEETINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MEETINGS;
  } catch (err) {
    console.error('Error reading meetings from localStorage:', err);
    return INITIAL_MEETINGS;
  }
}

export function saveAllMeetings(meetings) {
  try {
    localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings));
  } catch (err) {
    console.error('Error saving meetings to localStorage:', err);
  }
}

export function getMeetingById(meetingId) {
  const meetings = getAllMeetings();
  return meetings.find(m => m.id === meetingId) || null;
}

export function getMeetingsForStartup(startupId) {
  const meetings = getAllMeetings();
  // If startupId matches or matches current demo startup
  return meetings.filter(m => m.startupId === startupId || startupId === 'agrismart-tunisia');
}

export function getMeetingsForInvestor(investorId) {
  const meetings = getAllMeetings();
  return meetings.filter(m => m.investorId === investorId || investorId === 'inv-1');
}

export function createMeeting({
  startupId,
  startupName = 'Tunisian Startup',
  investorId,
  investorName = 'Tunisian Investor',
  requestedBy = 'investor',
  scheduledAt,
  durationMinutes = 45,
  agenda = 'StartupY Meeting intro and due diligence discussion.'
}) {
  const meetings = getAllMeetings();
  const rawId = `meeting_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6)}`;
  const cleanId = rawId.replace(/[^a-zA-Z0-9_]/g, '_');
  const roomId = generateSafeRoomId(cleanId);

  const newMeeting = {
    id: cleanId,
    startupId,
    startupName,
    investorId,
    investorName,
    requestedBy,
    scheduledAt: scheduledAt || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    durationMinutes: Number(durationMinutes) || 45,
    status: 'requested', // "requested" | "accepted" | "declined" | "completed" | "cancelled"
    roomId,
    agenda: agenda.trim() || 'StartupY Meeting discussion.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    outcomeStatus: null
  };

  const updated = [newMeeting, ...meetings];
  saveAllMeetings(updated);
  return newMeeting;
}

export function updateMeetingStatus(meetingId, status, extraFields = {}) {
  const meetings = getAllMeetings();
  const updated = meetings.map(m => {
    if (m.id === meetingId) {
      return {
        ...m,
        status,
        ...extraFields,
        updatedAt: new Date().toISOString()
      };
    }
    return m;
  });
  saveAllMeetings(updated);
  return updated.find(m => m.id === meetingId) || null;
}

export function updateMeetingOutcome(meetingId, outcomeStatus) {
  return updateMeetingStatus(meetingId, 'completed', { outcomeStatus });
}

/**
 * Check if a meeting is currently joinable:
 * - Status must be "accepted"
 * - Within 30 minutes before scheduledAt until scheduledAt + durationMinutes + 30 mins, OR demoOverride is active.
 */
export function isMeetingJoinable(meeting, demoOverride = false) {
  if (!meeting || meeting.status !== 'accepted') return false;
  if (demoOverride) return true;

  const now = Date.now();
  const scheduledTime = new Date(meeting.scheduledAt).getTime();
  const durationMs = (meeting.durationMinutes || 45) * 60 * 1000;

  // Window: from 30 mins before up to 30 mins after end time
  const startWindow = scheduledTime - 30 * 60 * 1000;
  const endWindow = scheduledTime + durationMs + 30 * 60 * 1000;

  return now >= startWindow && now <= endWindow;
}
