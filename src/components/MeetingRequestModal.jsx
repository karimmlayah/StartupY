import React, { useState } from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  FileText,
  Building2,
  Sparkles
} from 'lucide-react';
import { createMeeting } from '../utils/meetingStorage';
import { createMeetingRequest } from '../lib/supabaseData';

const getDefaultMeetingDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(10, 0, 0, 0);
  return date.toISOString().slice(0, 16);
};

export default function MeetingRequestModal({ 
  isOpen, 
  onClose, 
  startup, 
  investor, 
  onMeetingCreated 
}) {
  const [scheduledAt, setScheduledAt] = useState(getDefaultMeetingDate);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [agenda, setAgenda] = useState(() => startup ? `Initial deal qualification and team introduction regarding ${startup.name}'s ${startup.fundingNeeded} fundraising round.` : 'Initial deal qualification and team introduction.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !startup) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        startupId: startup.id,
        startupName: startup.name,
        investorId: investor?.id || 'inv-1',
        investorName: investor?.name || 'Carthage Angels Network',
        requestedBy: 'investor',
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes),
        agenda: agenda.trim()
      };
      let newMeeting = null;
      try {
        newMeeting = await createMeetingRequest(payload);
      } catch {
        newMeeting = createMeeting(payload);
      }

      setIsSuccess(true);
      if (onMeetingCreated) {
        onMeetingCreated(newMeeting);
      }
    } catch (err) {
      console.error('Failed to create meeting request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cream backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-surface-elevated border border-sand rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-sm relative space-y-6 text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted hover:text-white hover:bg-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-success-bg/20 text-success border border-success/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Bidaya Meeting Requested</h3>
              <p className="text-sm text-brown-mid mt-2">
                Your meeting request with <strong>{startup.name}</strong> has been transmitted. The founder can accept or suggest alternative timings.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-sand text-xs text-muted text-left space-y-2">
              <div className="flex items-center gap-2 text-brown-mid font-semibold">
                <Calendar className="w-4 h-4 text-coral" />
                <span>{new Date(scheduledAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} ({durationMinutes} mins)</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-coral" />
                <span>Secure in-platform video call powered by ZEGOCLOUD WebKit</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl font-bold text-sm bg-coral text-white transition-all shadow-sm"
            >
              Back to Startup Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral/10 text-coral text-xs font-bold border border-coral/40 mb-2">
                <Video className="w-3.5 h-3.5 text-coral" />
                <span>In-Platform Bidaya Meeting</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Request a Meeting with {startup.name}
              </h2>
              <p className="text-xs text-muted mt-1">
                Schedule a confidential one-to-one video call with {startup.governorate}-based founders.
              </p>
            </div>

            {/* Date & Time Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brown-mid flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-coral" />
                <span>Proposed Date & Time (Tunisia Time, GMT+1)</span>
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-sand text-sm text-white focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
            </div>

            {/* Duration Selector: 30, 45 or 60 minutes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brown-mid flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-coral" />
                <span>Meeting Duration</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      durationMinutes === mins
                        ? 'bg-coral/10 text-white border-coral/40 shadow-md'
                        : 'bg-surface text-brown-mid border-sand hover:bg-sand'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Agenda / Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brown-mid flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-warning" />
                <span>Meeting Agenda & Discussion Topics</span>
              </label>
              <textarea
                rows={3}
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="What topics would you like to cover in this session?"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-sand text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-coral/30 placeholder:text-taupe"
              />
            </div>

            {/* Privacy Notice Required */}
            <div className="p-3.5 rounded-xl bg-surface/50 border border-sand text-[11px] text-muted space-y-1">
              <div className="flex items-center gap-1.5 text-brown-mid font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Bidaya Private In-App Call</span>
              </div>
              <p>
                This meeting is private and accessible only to the accepted startup and investor. Recording and transcription are disabled by default.
              </p>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-brown-mid hover:text-white bg-surface hover:bg-sand transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-coral transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Video className="w-4 h-4" />
                <span>{isSubmitting ? 'Requesting...' : 'Send Meeting Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
