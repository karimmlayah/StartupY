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

export default function MeetingRequestModal({ 
  isOpen, 
  onClose, 
  startup, 
  investor,
  onMeetingCreated 
}) {
  if (!isOpen || !startup) return null;

  // Default to tomorrow at 10:00 AM
  const defaultDate = new Date(Date.now() + 24 * 3600 * 1000);
  defaultDate.setHours(10, 0, 0, 0);
  const formattedDefault = defaultDate.toISOString().slice(0, 16);

  const [scheduledAt, setScheduledAt] = useState(formattedDefault);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [agenda, setAgenda] = useState(`Initial deal qualification and team introduction regarding ${startup.name}'s ${startup.fundingNeeded} fundraising round.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newMeeting = createMeeting({
        startupId: startup.id,
        startupName: startup.name,
        investorId: investor?.id || 'inv-1',
        investorName: investor?.name || 'Carthage Angels Network',
        requestedBy: 'investor',
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes),
        agenda: agenda.trim()
      });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Bidaya Meeting Requested</h3>
              <p className="text-sm text-slate-300 mt-2">
                Your meeting request with <strong>{startup.name}</strong> has been transmitted. The founder can accept or suggest alternative timings.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 text-left space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>{new Date(scheduledAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} ({durationMinutes} mins)</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-violet-400" />
                <span>Secure in-platform video call powered by ZEGOCLOUD WebKit</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white transition-all shadow-lg shadow-blue-600/20"
            >
              Back to Startup Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 text-blue-400 text-xs font-bold border border-blue-800/60 mb-2">
                <Video className="w-3.5 h-3.5 text-blue-400" />
                <span>In-Platform Bidaya Meeting</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Request a Meeting with {startup.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Schedule a confidential one-to-one video call with {startup.governorate}-based founders.
              </p>
            </div>

            {/* Date & Time Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Proposed Date & Time (Tunisia Time, GMT+1)</span>
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Duration Selector: 30, 45 or 60 minutes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
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
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Agenda / Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Meeting Agenda & Discussion Topics</span>
              </label>
              <textarea
                rows={3}
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="What topics would you like to cover in this session?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
              />
            </div>

            {/* Privacy Notice Required */}
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
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
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
