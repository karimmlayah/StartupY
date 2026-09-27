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

export default function MeetingCenter({ role = 'startup', currentId, onOpenAiGuide }) {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'pending' | 'past'
  const [demoOverride, setDemoOverride] = useState(true); // Demo mode allows instant join for testing
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadMeetings = () => {
    const all = getAllMeetings();
    setMeetings(all);
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleStatusChange = (meetingId, newStatus) => {
    updateMeetingStatus(meetingId, newStatus);
    loadMeetings();
    setFeedbackMsg(`Meeting status updated to ${newStatus}.`);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleProposeTime = (meetingId) => {
    const newTime = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
    updateMeetingStatus(meetingId, 'requested', { scheduledAt: newTime });
    loadMeetings();
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
    accepted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    requested: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    completed: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    declined: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    cancelled: 'bg-slate-700 text-slate-400 border-slate-600'
  };

  const outcomeColors = {
    'Interested': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Follow-up Needed': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Declined': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'No Show': 'bg-slate-700 text-slate-300 border-slate-600'
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      
      {/* Header with Title and Demo Instant-Join Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 text-blue-400 text-xs font-bold border border-blue-800/60 mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>Bidaya Meeting Center</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">ZEGOCLOUD WebKit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            In-App Video Meetings
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Confidential 1-on-1 virtual deal rooms between Tunisian founders and verified investors.
          </p>
        </div>

        {/* Demo Instant Join Switch */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <button 
            type="button"
            onClick={() => setDemoOverride(!demoOverride)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {demoOverride ? (
              <ToggleRight className="w-6 h-6 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-500" />
            )}
            <span>Demo Instant Join: {demoOverride ? <strong className="text-emerald-400">Active</strong> : <span className="text-slate-400">Time-Gated</span>}</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-800 text-xs text-blue-300 flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Upcoming Sessions</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-900/60 text-[10px]">
            {upcomingMeetings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Pending Requests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-900/60 text-[10px]">
            {pendingMeetings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'past'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Past Meetings & Outcomes</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-900/60 text-[10px]">
            {pastMeetings.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Upcoming Meetings */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((m) => {
              const joinable = isMeetingJoinable(m, demoOverride);
              const formattedDate = new Date(m.scheduledAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              });

              return (
                <div 
                  key={m.id}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusBadges[m.status]}`}>
                        {m.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.durationMinutes} min session</span>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-violet-400" />
                      <span>{role === 'startup' ? m.investorName : m.startupName}</span>
                    </h4>

                    <p className="text-xs text-slate-300 max-w-xl line-clamp-2">
                      <strong className="text-slate-400">Agenda:</strong> {m.agenda}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleJoinMeeting(m)}
                      disabled={!joinable}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                        joinable
                          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-emerald-600/30 animate-pulse hover:scale-105'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                      title={joinable ? 'Join Video Room' : 'Join available 30 min before call time (or toggle Demo Instant Join)'}
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Bidaya Meeting</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(m.id, 'cancelled')}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm space-y-2">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p>No confirmed upcoming Bidaya Meetings scheduled.</p>
              <p className="text-xs text-slate-500">
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
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusBadges[m.status]}`}>
                        {m.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Proposed: {formattedDate}</span>
                        <span>•</span>
                        <span>{m.durationMinutes} min</span>
                      </span>
                      <span className="text-[11px] text-blue-400 font-medium">
                        Requested by {m.requestedBy === 'investor' ? m.investorName : m.startupName}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-violet-400" />
                      <span>{role === 'startup' ? m.investorName : m.startupName}</span>
                    </h4>

                    <p className="text-xs text-slate-300 max-w-xl">
                      <strong className="text-slate-400">Proposed Agenda:</strong> {m.agenda}
                    </p>
                  </div>

                  {/* Actions depending on role */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isReceivedByMe ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(m.id, 'accepted')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleProposeTime(m.id)}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer"
                        >
                          Propose Another Time
                        </button>
                        <button
                          onClick={() => handleStatusChange(m.id, 'declined')}
                          className="px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 italic">Waiting for counterparty response</span>
                        <button
                          onClick={() => handleStatusChange(m.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/60 transition-colors"
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
            <div className="py-12 text-center text-slate-400 text-sm space-y-2">
              <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
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
                  className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-90"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusBadges[m.status]}`}>
                        {m.status}
                      </span>
                      {m.outcomeStatus && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${outcomeColors[m.outcomeStatus] || 'bg-slate-700 text-slate-300'}`}>
                          Outcome: {m.outcomeStatus}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {formattedDate} ({m.durationMinutes} min)
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{role === 'startup' ? m.investorName : m.startupName}</span>
                    </h4>

                    <p className="text-xs text-slate-400 max-w-xl">
                      {m.agenda}
                    </p>
                  </div>

                  <div className="text-xs text-slate-500">
                    Session Concluded
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm space-y-2">
              <p>No historical meetings recorded yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Privacy and Consent Banner (Requirement 7) */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bidaya Tunisia Security, Privacy & Consent Protocol</span>
        </div>
        <ul className="list-disc pl-5 space-y-0.5 text-slate-400">
          <li>This meeting is private and accessible only to the accepted startup and investor.</li>
          <li>Recording and transcription are disabled by default.</li>
          <li>Any recording or transcription requires explicit consent from all participants.</li>
        </ul>
      </div>

    </div>
  );
}
