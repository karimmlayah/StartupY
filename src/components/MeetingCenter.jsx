import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  Play, 
  Lock, 
  FileText, 
  Building2, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { 
  getAllMeetings, 
  updateMeetingStatus, 
  isMeetingJoinable 
} from '../utils/meetingStorage';
import { fetchMeetings, updateMeeting } from '../lib/supabaseData';

export default function MeetingCenter({ role = 'startup', currentId, onOpenAiGuide }) {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'pending' | 'past'
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMeetings = async () => {
    setLoading(true);
    setError('');
    try {
      let all = await fetchMeetings(role === 'startup' ? { startupId: currentId } : { investorId: currentId }).catch(() => []);
      if (!all || all.length === 0) all = getAllMeetings();
      setMeetings(all);
    } catch (err) {
      setMeetings([]);
      setError(err.message || 'Unable to load meetings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [currentId, role]);

  const handleStatusChange = async (meetingId, newStatus) => {
    await updateMeeting(meetingId, { status: newStatus }).catch(() => {
      updateMeetingStatus(meetingId, newStatus);
    });
    await loadMeetings();
    setFeedbackMsg(`Meeting status updated to ${newStatus}.`);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleProposeTime = async (meetingId) => {
    const newTime = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
    await updateMeeting(meetingId, { status: 'requested', scheduledAt: newTime }).catch(() => {
      updateMeetingStatus(meetingId, 'requested', { scheduledAt: newTime });
    });
    await loadMeetings();
    setFeedbackMsg('Proposed alternative time (48 hours ahead). Request updated.');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleJoinMeeting = (meeting) => {
    navigate(`/meeting/${meeting.id}`);
  };

  // Group meetings
  const upcomingMeetings = meetings.filter(m => m.status === 'accepted');
  const pendingMeetings = meetings.filter(m => m.status === 'requested');
  const pastMeetings = meetings.filter(m => ['completed', 'declined', 'cancelled'].includes(m.status));

  const statusBadges = {
    accepted: 'bg-success-bg/20 text-success border-success/30',
    requested: 'bg-warning-bg/20 text-warning border-warning/30',
    completed: 'bg-coral-dark/20 text-coral border-coral/40',
    declined: 'bg-danger-bg0/20 text-danger border-danger/30',
    cancelled: 'bg-sand text-muted border-sand'
  };

  const outcomeColors = {
    'Interested': 'bg-success-bg/20 text-success border-success/30',
    'Follow-up Needed': 'bg-warning-bg/20 text-warning border-warning/30',
    'Declined': 'bg-danger-bg0/20 text-danger border-danger/30',
    'No Show': 'bg-sand text-brown-mid border-sand'
  };

  return (
    <div className="bg-surface-elevated rounded-xl p-6 sm:p-8 border border-sand shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-sand">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 text-coral text-xs font-bold border border-coral/40 mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>Bidaya Meeting Center</span>
            <span className="text-taupe">•</span>
            <span className="text-muted">ZEGOCLOUD WebKit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            In-App Video Meetings
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Confidential 1-on-1 virtual deal rooms between Tunisian founders and verified investors.
          </p>
        </div>

      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-coral/10 border border-coral/40 text-xs text-coral flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-coral flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {error && <div className="rounded-lg border border-danger/30 bg-danger-bg p-4 text-sm text-danger">{error} <button onClick={loadMeetings} className="ml-2 underline">Retry</button></div>}
      {loading && <div className="h-28 animate-pulse rounded-lg border border-sand bg-surface" />}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sand pb-3 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'bg-coral/10 text-white shadow-md'
              : 'text-muted hover:text-white hover:bg-surface'
          }`}
        >
          <span>Upcoming Sessions</span>
          <span className="px-1.5 py-0.2 rounded-full bg-surface text-[10px]">
            {upcomingMeetings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-warning-bg text-white shadow-md'
              : 'text-muted hover:text-white hover:bg-surface'
          }`}
        >
          <span>Pending Requests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-surface text-[10px]">
            {pendingMeetings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'past'
              ? 'bg-coral/10 text-white shadow-md'
              : 'text-muted hover:text-white hover:bg-surface'
          }`}
        >
          <span>Past Meetings & Outcomes</span>
          <span className="px-1.5 py-0.2 rounded-full bg-surface text-[10px]">
            {pastMeetings.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Upcoming Meetings */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((m) => {
              const joinable = isMeetingJoinable(m, false);
              const formattedDate = new Date(m.scheduledAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              });

              return (
                <div 
                  key={m.id}
                  className="p-5 rounded-lg bg-surface border border-sand hover:border-sand transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusBadges[m.status]}`}>
                        {m.status}
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-coral" />
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5 text-muted" />
                        <span>{m.durationMinutes} min session</span>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-coral" />
                      <span>{role === 'startup' ? m.investorName : m.startupName}</span>
                    </h4>

                    <p className="text-xs text-brown-mid max-w-xl line-clamp-2">
                      <strong className="text-muted">Agenda:</strong> {m.agenda}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleJoinMeeting(m)}
                      disabled={!joinable}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                        joinable
                          ? 'bg-coral text-white hover:bg-coral-dark'
                          : 'bg-surface text-taupe border border-sand cursor-not-allowed'
                      }`}
                      title={joinable ? 'Join Video Room' : 'Join available 30 minutes before the call'}
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Bidaya Meeting</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(m.id, 'cancelled')}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-muted hover:text-danger hover:bg-sand/60 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted text-sm space-y-2">
              <Calendar className="w-10 h-10 text-muted mx-auto mb-2" />
              <p>No confirmed upcoming Bidaya Meetings scheduled.</p>
              <p className="text-xs text-taupe">
                Check pending requests or schedule a new meeting from any startup profile.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pending Requests */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingMeetings.length > 0 ? (
            pendingMeetings.map((m) => {
              const formattedDate = new Date(m.scheduledAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              });
              const isReceivedByMe = (role === 'startup' && m.requestedBy === 'investor') || (role === 'investor' && m.requestedBy === 'startup');

              return (
                <div 
                  key={m.id}
                  className="p-5 rounded-lg bg-surface border border-sand flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusBadges[m.status]}`}>
                        {m.status}
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-coral" />
                        <span>Proposed: {formattedDate}</span>
                        <span>•</span>
                        <span>{m.durationMinutes} min</span>
                      </span>
                      <span className="text-[11px] text-coral font-medium">
                        Requested by {m.requestedBy === 'investor' ? m.investorName : m.startupName}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-coral" />
                      <span>{role === 'startup' ? m.investorName : m.startupName}</span>
                    </h4>

                    <p className="text-xs text-brown-mid max-w-xl">
                      <strong className="text-muted">Proposed Agenda:</strong> {m.agenda}
                    </p>
                  </div>

                  {/* Actions depending on role */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isReceivedByMe ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(m.id, 'accepted')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-success-bg hover:bg-success-bg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleProposeTime(m.id)}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-brown-mid bg-sand hover:bg-taupe transition-colors cursor-pointer"
                        >
                          Propose Another Time
                        </button>
                        <button
                          onClick={() => handleStatusChange(m.id, 'declined')}
                          className="px-3 py-2 rounded-xl text-xs font-medium text-danger hover:bg-danger-bg transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted italic">Waiting for counterparty response</span>
                        <button
                          onClick={() => handleStatusChange(m.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-danger hover:bg-danger-bg transition-colors"
                        >
                          Cancel Request
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted text-sm space-y-2">
              <Clock className="w-10 h-10 text-muted mx-auto mb-2" />
              <p>No pending meeting requests.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Past Meetings & Outcomes */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastMeetings.length > 0 ? (
            pastMeetings.map((m) => {
              const formattedDate = new Date(m.scheduledAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              });

              return (
                <div 
                  key={m.id}
                  className="p-5 rounded-lg bg-surface border border-sand flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-90"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusBadges[m.status]}`}>
                        {m.status}
                      </span>
                      {m.outcomeStatus && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${outcomeColors[m.outcomeStatus] || 'bg-sand text-brown-mid'}`}>
                          Outcome: {m.outcomeStatus}
                        </span>
                      )}
                      <span className="text-xs text-muted">
                        {formattedDate} ({m.durationMinutes} min)
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{role === 'startup' ? m.investorName : m.startupName}</span>
                    </h4>

                    <p className="text-xs text-muted max-w-xl">
                      {m.agenda}
                    </p>
                  </div>

                  <div className="text-xs text-taupe">
                    Session Concluded
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted text-sm space-y-2">
              <p>No historical meetings recorded yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Privacy and Consent Banner (Requirement 7) */}
      <div className="pt-4 border-t border-sand text-[11px] text-muted space-y-1.5">
        <div className="flex items-center gap-1.5 text-brown-mid font-semibold">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Bidaya Tunisia Security, Privacy & Consent Protocol</span>
        </div>
        <ul className="list-disc pl-5 space-y-0.5 text-muted">
          <li>This meeting is private and accessible only to the accepted startup and investor.</li>
          <li>Recording and transcription are disabled by default.</li>
          <li>Any recording or transcription requires explicit consent from all participants.</li>
        </ul>
      </div>

    </div>
  );
}
