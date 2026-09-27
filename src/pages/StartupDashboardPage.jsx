import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Sparkles, 
  Users, 
  Eye, 
  Clock, 
  Check, 
  X, 
  Coins, 
  Layers, 
  MapPin, 
  Send,
  PlusCircle,
  ExternalLink,
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Info,
  AlertCircle
} from 'lucide-react';
import { getCurrentStartup } from '../utils/storage';
import { INITIAL_INVESTORS, MOCK_INTERESTED_REQUESTS } from '../data/mockInvestors';
import { calculateSmartMatch } from '../utils/matchEngine';
import MeetingCenter from '../components/MeetingCenter';
import StartupRoadmap from '../components/StartupRoadmap';
import PublicationStatusPanel from '../components/PublicationStatusPanel';
import StartupActModule from '../components/StartupActModule';
import { useAuth } from '../context/AuthContext';
import { fetchApprovedInvestors, fetchInterests, fetchOwnStartup, fetchStartupProgress } from '../lib/supabaseData';

export default function StartupDashboardPage({ onOpenAiGuide }) {
  const location = useLocation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [progress, setProgress] = useState([]);
  const [investorRequests, setInvestorRequests] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [requestedIntros, setRequestedIntros] = useState({});
  const [notification, setNotification] = useState('');
  
  // State for "View Match Details" Modal (Requirement 5)
  const [selectedMatchInvestor, setSelectedMatchInvestor] = useState(null);

  const loadDashboard = async () => {
    setDataLoading(true);
    setDataError('');
    try {
      const startup = await fetchOwnStartup(user?.id).catch(() => null);
      setProfile(startup || getCurrentStartup());
      const [approvedInvestors, startupProgress, interests] = await Promise.all([
        fetchApprovedInvestors().catch(() => INITIAL_INVESTORS),
        startup?.id ? fetchStartupProgress(startup.id).catch(() => []) : Promise.resolve([]),
        startup?.id ? fetchInterests({ startupId: startup.id }).catch(() => []) : Promise.resolve([]),
      ]);
      setInvestors(approvedInvestors?.length ? approvedInvestors : INITIAL_INVESTORS);
      setProgress(startupProgress || []);
      setInvestorRequests((interests || []).map((item) => ({
        id: item.id,
        investorId: item.investor_id || item.investor,
        investorName: item.investor_name || item.investors?.organization_name || 'Investor',
        firm: item.investor_name || item.investors?.organization_name || '',
        status: item.status,
      })));
    } catch (err) {
      setDataError(err.message || 'Unable to load startup dashboard.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => { if (user?.id) loadDashboard(); }, [user?.id]);

  const handleAcceptRequest = (id, investorName) => {
    setInvestorRequests(prev => prev.filter(r => r.id !== id));
    setNotification(`Accepted interest from ${investorName}. Intro thread generated.`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeclineRequest = (id) => {
    setInvestorRequests(prev => prev.filter(r => r.id !== id));
    setNotification('Declined investor request.');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleRequestIntro = (investorId, investorName) => {
    setRequestedIntros(prev => ({ ...prev, [investorId]: true }));
    setNotification(`Intro request dispatched to ${investorName}.`);
    setTimeout(() => setNotification(''), 4000);
  };

  // Evaluate and sort suggested investors by deterministic match score (Requirement 5)
  const rankedInvestors = useMemo(() => {
    if (!profile) return [];

    return investors.map(inv => {
      const match = calculateSmartMatch(profile, inv);
      return {
        ...inv,
        smartMatch: match
      };
    }).sort((a, b) => b.smartMatch.score - a.smartMatch.score);
  }, [profile, investors]);

  if (dataLoading) return <div className="mx-auto max-w-7xl px-6 py-16"><div className="h-48 animate-pulse rounded-lg border border-sand bg-surface" /></div>;
  if (dataError) return <div className="mx-auto max-w-3xl px-6 py-16 text-center"><p className="text-danger">{dataError}</p><button onClick={loadDashboard} className="mt-4 rounded-md bg-coral px-4 py-2 text-sm text-white">Retry</button></div>;
  if (!profile) return <div className="mx-auto max-w-3xl px-6 py-16 text-center"><h1 className="text-3xl">No startup profile yet</h1><p className="mt-2 text-muted">Create your startup profile to begin your StartupY journey.</p><Link to="/onboarding/startup" className="mt-5 inline-block rounded-md bg-coral px-5 py-3 text-sm text-white">Create startup profile</Link></div>;

  const interestedCount = investorRequests.length;

  const labelBadgeClasses = {
    'Excellent Match': 'bg-success-bg text-success border-success/30',
    'Strong Match': 'bg-coral/10 text-coral border-coral/40',
    'Potential Match': 'bg-warning-bg text-warning border-warning/30',
    'Low Match': 'bg-danger-bg text-danger border-danger/30'
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Access Denied Warning Banner */}
      {location.state?.accessDenied && (
        <div className="p-4 rounded-lg bg-danger-bg0/20 border border-danger/30 text-danger text-sm font-semibold flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
          <span>{location.state.message || "Access denied. You do not have permission to view this page."}</span>
        </div>
      )}

      {/* Top Banner / Notification */}
      {notification && (
        <div className="p-4 rounded-lg bg-success-bg/20 border border-success/30 text-success text-sm font-semibold flex items-center justify-between animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="text-success hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sand">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/40 text-xs font-semibold text-coral mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Espace fondateur</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Tableau de bord startup
          </h1>
          <p className="text-sm text-muted mt-1">
            Suivez votre progression, vos investisseurs et vos prochaines actions.
          </p>
        </div>

        {/* Required Button: “Ask Startup Tunisia Guide” */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAiGuide('startup')}
            className="flex items-center gap-2 rounded-md bg-coral px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-coral-dark hover:shadow-md"
          >
            <Sparkles className="size-4" />
            <span>Demander au guide IA</span>
          </button>

          <Link
            to="/onboarding/startup"
            className="flex items-center gap-1.5 rounded-md border border-sand bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-coral/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Modifier le profil</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        
        {/* KPI 1: Number of Interested Investors */}
        <div className="bg-surface-elevated rounded-lg p-5 border border-sand shadow-sm">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Interested Investors</span>
            <Users className="w-4 h-4 text-coral" />
          </div>
          <div className="font-display text-3xl text-ink">
            {interestedCount}
          </div>
          <div className="text-xs text-success mt-1 flex items-center gap-1">
            <span>+{investorRequests.length} active inbounds</span>
          </div>
        </div>

        {/* KPI 2: Profile Views */}
        <div className="bg-surface-elevated rounded-lg p-5 border border-sand shadow-sm">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Investor Views</span>
            <Eye className="w-4 h-4 text-coral" />
          </div>
          <div className="font-display text-3xl text-ink">
            184
          </div>
          <div className="text-xs text-muted mt-1">
            Angels & funds in Tunisia
          </div>
        </div>

        {/* KPI 3: AI Readiness Score */}
        <div className="bg-surface-elevated rounded-lg p-5 border border-sand shadow-sm">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Highest Investor Fit</span>
            <Sparkles className="w-4 h-4 text-success" />
          </div>
          <div className="font-display text-3xl text-bronze">
            {rankedInvestors[0]?.smartMatch?.score || 95}%
          </div>
          <div className="text-xs text-muted mt-1">
            {rankedInvestors[0]?.name}
          </div>
        </div>

      </div>

      {/* Profile Summary Card (Crisp White Card on Dark Navy Background) */}
      <div className="bg-surface-elevated text-ink rounded-xl p-6 sm:p-8 border border-sand shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sand">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-coral text-white font-semibold text-xl flex items-center justify-center shadow-sm">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'TN'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-ink">
                  {profile.name || 'Votre startup'}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/40">
                  {profile.stage || 'Early Revenue'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success-bg text-success border border-success/30">
                  {profile.legalStatus || 'SARL'}
                </span>
              </div>
              <p className="text-muted text-xs sm:text-sm mt-1 max-w-2xl">
                {profile.pitch || 'Precision drip irrigation IoT telemetry optimizing water and olive crop yields across Sfax.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/startup/${profile.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-ink bg-sand/60 hover:bg-sand transition-colors"
            >
              <span>View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Profile Details Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div>
            <span className="text-muted font-medium block">Sector</span>
            <span className="font-bold text-ink text-sm mt-0.5 block">
              {profile.sector || 'AgriTech'}
            </span>
          </div>
          <div>
            <span className="text-muted font-medium block">Funding Target (TND)</span>
            <span className="font-bold text-coral text-sm mt-0.5 block">
              {profile.fundingNeeded || '450,000 TND'}
            </span>
          </div>
          <div>
            <span className="text-muted font-medium block">Governorate</span>
            <span className="font-bold text-ink text-sm mt-0.5 block">
              {profile.governorate || 'Sfax'}, Tunisia
            </span>
          </div>
          <div>
            <span className="text-muted font-medium block">Funding Type Sought</span>
            <span className="font-bold text-ink text-sm mt-0.5 block">
              {profile.fundingTypeSought || 'Seed Investment'}
            </span>
          </div>
        </div>
      </div>

      {/* Publication Status & Investor Visibility */}
      <PublicationStatusPanel
        startupId={profile?.id}
        onStatusChange={(state) => {
          setNotification(`Status updated to: ${state.publication_status}`);
          setTimeout(() => setNotification(''), 4000);
        }}
      />

      {/* Startup Act Label Module (Optional, Separate from Publication) */}
      <StartupActModule />

      {/* 11-Step Startup Roadmap Engine (Requirement 4) */}
      <StartupRoadmap
        onOpenAiGuide={onOpenAiGuide}
        initialProgress={progress}
      />

      {/* Bidaya Meeting Center (Requirements 4, 6, 7, 8) */}
      <MeetingCenter
        role="startup"
        currentId={profile?.id}
        onOpenAiGuide={onOpenAiGuide}
      />

      {/* Two Column Grid: Inbound Investor Requests + Suggested Investor Matches Sorted by Calculated Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Inbound Investor Requests */}
        <div className="bg-surface-elevated rounded-xl p-6 sm:p-8 border border-sand shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-coral" />
                <span>Interested Investors Inbound</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Investors requesting intro meetings or data room access.
              </p>
            </div>
            <span className="text-xs font-bold text-coral bg-coral/10 px-2.5 py-1 rounded-full border border-coral/40">
              {investorRequests.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {investorRequests.length > 0 ? (
              investorRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-lg bg-surface border border-sand space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-coral text-white font-bold text-xs flex items-center justify-center shadow-md`}>
                        {req.investorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{req.investorName}</div>
                        <div className="text-xs text-muted">{req.firm} • <span className="text-coral font-semibold">{req.checkSize}</span></div>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted">{req.date}</span>
                  </div>

                  <p className="text-xs text-brown-mid leading-relaxed bg-surface p-3 rounded-xl border border-sand">
                    "{req.note}"
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAcceptRequest(req.id, req.investorName)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs text-white bg-coral/10 hover:bg-coral-dark transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept & Schedule Intro</span>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="py-2 px-3 rounded-xl font-semibold text-xs text-muted hover:text-brown-mid bg-surface hover:bg-sand transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted text-sm">
                No pending investor inbounds. We are featuring your profile to Tunisian angel syndicates.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Suggested Investor Matches with Real Match Scores (Requirement 5) */}
        <div className="bg-surface-elevated rounded-xl p-6 sm:p-8 border border-sand shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-coral" />
                <span>Suggested Tunisian Investors</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Sorted by deterministic compatibility against your profile.
              </p>
            </div>
            <span className="text-xs font-bold text-coral bg-coral/10 px-2.5 py-1 rounded-full border border-coral/40">
              Smart Ranked
            </span>
          </div>

          <div className="space-y-4">
            {rankedInvestors.map((inv) => {
              const requested = requestedIntros[inv.id];
              const match = inv.smartMatch;

              return (
                <div key={inv.id} className="p-4 rounded-lg bg-surface border border-sand space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{inv.name}</h4>
                        {/* Show Compatibility Score and Label (Requirement 5) */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${labelBadgeClasses[match?.label || 'Potential Match']}`}>
                          {match?.score || 85}% • {match?.label || 'Fit'}
                        </span>
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {inv.partner} • {inv.type}
                      </div>
                    </div>

                    {/* Show Ticket Range (Requirement 5) */}
                    <span className="text-xs font-bold text-brown-mid bg-surface-elevated px-2.5 py-1 rounded-lg border border-sand">
                      {inv.ticketSize || inv.budgetRange}
                    </span>
                  </div>

                  <p className="text-xs text-brown-mid leading-relaxed">
                    {inv.thesis}
                  </p>

                  {/* Show Focus Sectors (Requirement 5) */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      Focus Sectors:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {(inv.sectors || inv.focus || []).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-surface-elevated text-brown-mid border border-sand">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    {/* View Match Details Action (Requirement 5) */}
                    <button
                      onClick={() => setSelectedMatchInvestor(inv)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs text-brown-mid bg-surface hover:bg-sand hover:text-white border border-sand transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-coral" />
                      <span>View Match Details</span>
                    </button>

                    <button
                      onClick={() => handleRequestIntro(inv.id, inv.name)}
                      disabled={requested}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                        requested
                          ? 'bg-sand text-success border border-success/30'
                          : 'bg-coral text-white shadow-md'
                      }`}
                    >
                      {requested ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-success" />
                          <span>Intro Request Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Request Intro</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Match Details Modal (Requirement 5) */}
      {selectedMatchInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cream backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-surface-elevated border border-sand rounded-xl p-6 sm:p-8 text-white shadow-sm max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedMatchInvestor(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-coral bg-coral/10 px-2.5 py-0.5 rounded-full border border-coral/40">
                  Smart Match Evaluation
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${labelBadgeClasses[selectedMatchInvestor.smartMatch?.label]}`}>
                  {selectedMatchInvestor.smartMatch?.score}% • {selectedMatchInvestor.smartMatch?.label}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Match Details: {profile.name} × {selectedMatchInvestor.name}
              </h3>
              <p className="text-xs text-muted mt-1">
                Ticket Range: {selectedMatchInvestor.ticketSize || selectedMatchInvestor.budgetRange} • Focus: {(selectedMatchInvestor.sectors || selectedMatchInvestor.focus || []).join(', ')}
              </p>
            </div>

            {/* 6 Criteria Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-sand">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brown-mid">
                Criteria Breakdown (100 Pts):
              </h4>
              {selectedMatchInvestor.smartMatch?.breakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface/70 border border-sand text-xs space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-brown-mid">{item.criterion}</span>
                    <span className="text-coral font-mono">{item.score} / {item.maxScore} pts</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>

            {/* Strengths & Recommendation */}
            <div className="space-y-3 pt-2 border-t border-sand text-xs">
              <div>
                <h5 className="font-bold text-success uppercase tracking-wider text-[11px] mb-1">
                  Key Strengths:
                </h5>
                <ul className="space-y-1">
                  {selectedMatchInvestor.smartMatch?.strengths.map((str, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-brown-mid">
                      <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-coral/10 border border-coral/40 text-coral">
                <strong>Recommendation:</strong> {selectedMatchInvestor.smartMatch?.recommendation}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedMatchInvestor(null)}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-surface hover:bg-sand text-white transition-colors cursor-pointer"
              >
                Close Match Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
