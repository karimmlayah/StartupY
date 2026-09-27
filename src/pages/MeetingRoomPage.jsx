import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Video, 
  ShieldCheck, 
  ArrowLeft, 
  PhoneOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Lock,
  Building2,
  Calendar,
  Users
} from 'lucide-react';
import { getMeetingById, updateMeetingOutcome } from '../utils/meetingStorage';
import { getCurrentStartup, getCurrentInvestor } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { fetchMeetingById, updateMeeting } from '../lib/supabaseData';

export default function MeetingRoomPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user, profile, role } = useAuth();

  const containerRef = useRef(null);
  const zegoInstanceRef = useRef(null);

  const [meeting, setMeeting] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState('Interested');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const load = async () => {
      let loadedMeeting = await fetchMeetingById(meetingId).catch(() => null);
      if (!loadedMeeting) loadedMeeting = getMeetingById(meetingId);
      if (!loadedMeeting) {
        setError(`Meeting "${meetingId}" not found in StartupY records.`);
        setLoading(false);
        return;
      }
      setMeeting(loadedMeeting);

      const userRole = role || (loadedMeeting.requestedBy === 'investor' ? 'startup' : 'investor');
      const userId = user?.id || 'demo_user';
      const userName = user?.full_name || profile?.full_name || 'StartupY participant';

      setCurrentUser({ userId, userName, role: userRole });
    };
    load().catch((loadError) => { setError(loadError.message || 'Unable to load this meeting.'); setLoading(false); });
  }, [meetingId, user?.id, profile?.full_name, profile?.name, role]);

  useEffect(() => {
    if (!meeting || !currentUser || !containerRef.current || isJoined) return;

    let isMounted = true;

    async function initializeZegoCall() {
      try {
        setLoading(true);

        // 1. Fetch server-generated Kit Token strictly from the backend
        const tokenRes = await fetch(`/api/meetings/${meetingId}/join-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.userId,
            userName: currentUser.userName,
            role: currentUser.role,
            meeting
          })
        });

        if (!tokenRes.ok) {
          const errData = await tokenRes.json().catch(() => ({}));
          throw new Error(errData.error || `Server returned status ${tokenRes.status}`);
        }

        const { appID, kitToken, roomId } = await tokenRes.json();

        if (!isMounted) return;

        // 2. Import ZEGOCLOUD WebKit dynamically to prevent SSR/bundle issues
        const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');

        // 3. Create prebuilt call instance using the server token
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp;

        // 4. Join room in One-to-One Video Call mode
        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall, // One-to-one video call MVP
          },
          showPreJoinView: false,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          showLeavingView: false,
          onLeaveRoom: () => {
            handleMeetingEnded();
          },
          onReturnToHomeScreenClicked: () => {
            handleMeetingEnded();
          }
        });

        setIsJoined(true);
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize ZEGOCLOUD meeting:', err);
        if (isMounted) {
          setError(err.message || 'Failed to initialize video call session');
          setLoading(false);
        }
      }
    }

    initializeZegoCall();

    return () => {
      isMounted = false;
      if (zegoInstanceRef.current) {
        try {
          zegoInstanceRef.current.destroy();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [meeting, currentUser]);

  const handleMeetingEnded = () => {
    setShowOutcomeModal(true);
  };

  const handleSaveOutcome = async () => {
    if (meeting) {
      await updateMeeting(meeting.id, { outcomeStatus: selectedOutcome }).catch(() => {
        updateMeetingOutcome(meeting.id, selectedOutcome);
      });
    }
    setShowOutcomeModal(false);
    // Navigate back to appropriate dashboard
    if (currentUser?.role === 'investor') {
      navigate('/dashboard/investor');
    } else {
      navigate('/dashboard/startup');
    }
  };

  const handleManualLeave = () => {
    if (zegoInstanceRef.current) {
      try {
        zegoInstanceRef.current.hangUp();
      } catch (e) {
        // fallback
      }
    }
    handleMeetingEnded();
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      
      {/* Bidaya Tunisia Branded Top Header (Requirement 6) */}
      <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-sand bg-surface-elevated flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link 
            to={currentUser?.role === 'investor' ? '/dashboard/investor' : '/dashboard/startup'}
            className="p-2 rounded-xl text-muted hover:text-white hover:bg-surface transition-colors"
            title="Leave and return to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-coral flex items-center justify-center text-white font-semibold text-sm shadow-md">
              BT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm sm:text-base">
                  StartupY Meeting
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-bg/20 text-success border border-success/30">
                  Live Room
                </span>
              </div>
              <div className="text-[11px] text-muted hidden sm:block">
                {meeting ? `${meeting.startupName} ↔ ${meeting.investorName}` : 'Connecting...'}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Leave Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface text-[11px] text-brown-mid border border-sand">
            <Lock className="w-3.5 h-3.5 text-coral" />
            <span>Private One-on-One Session</span>
          </div>

          <button
            onClick={handleManualLeave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-danger hover:bg-danger transition-colors cursor-pointer shadow-md shadow-sm"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Leave Call</span>
          </button>
        </div>
      </header>

      {/* Privacy and Consent Banner (Requirement 7) */}
      <div className="bg-surface border-b border-sand px-4 py-2 text-[11px] text-muted flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
          <span>
            <strong>StartupY Privacy Notice:</strong> This meeting is private and accessible only to the accepted startup and investor. Recording and transcription are disabled by default.
          </span>
        </div>
        <span className="text-taupe hidden lg:inline">
          Any recording requires explicit consent from all participants.
        </span>
      </div>

      {/* Main Video Call Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-2 sm:p-4">
        
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-4 bg-cream/90">
            <div className="w-12 h-12 rounded-full border-4 border-coral/40 border-t-coral animate-spin"></div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-white text-base">Joining StartupY Video Room...</h3>
              <p className="text-xs text-muted">Negotiating secure WebRTC token with Express backend.</p>
            </div>
          </div>
        )}

        {error ? (
          <div className="max-w-md w-full p-6 rounded-xl bg-surface-elevated border border-danger/30 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-danger mx-auto" />
            <h3 className="text-lg font-bold text-white">Call Connection Error</h3>
            <p className="text-xs text-brown-mid">{error}</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/dashboard/startup"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-surface text-brown-mid hover:text-white"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* ZEGOCLOUD Video Call Container */
          <div 
            ref={containerRef} 
            className="w-full h-full min-h-[550px] max-w-6xl rounded-lg overflow-hidden bg-ink shadow-sm border border-sand"
          />
        )}

      </main>

      {/* Post-Meeting Outcome Modal (Requirement 6) */}
      {showOutcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cream backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-elevated border border-sand rounded-xl max-w-md w-full p-6 sm:p-7 shadow-sm space-y-5 text-ink">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-lg bg-success-bg/20 text-success border border-success/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-white">Session Concluded</h3>
              <p className="text-xs text-brown-mid">
                Please indicate the meeting outcome for <strong>{meeting?.startupName}</strong>:
              </p>
            </div>

            {/* Outcome Selection Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Interested', desc: 'Positive fit for investment' },
                { label: 'Follow-up Needed', desc: 'Schedule deep-dive' },
                { label: 'Declined', desc: 'Thesis not aligned' },
                { label: 'No Show', desc: 'Counterparty was absent' }
              ].map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelectedOutcome(opt.label)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedOutcome === opt.label
                      ? 'bg-coral/10 border-coral/40 text-white shadow-md'
                      : 'bg-surface/70 border-sand text-brown-mid hover:bg-surface'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-muted mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveOutcome}
              className="w-full py-3 rounded-xl font-bold text-sm bg-coral text-white shadow-sm transition-all cursor-pointer"
            >
              Save Outcome & Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
