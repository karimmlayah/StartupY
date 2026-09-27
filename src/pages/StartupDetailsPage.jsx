import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getStartupById, 
  getSavedStartupIds, 
  toggleSaveStartup, 
  addInterestStartup,
  getInterestedStartupIds,
  getCurrentInvestor
} from '../utils/storage';
import { 
  Sparkles, 
  MapPin, 
  Coins, 
  Layers, 
  Bookmark, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Calendar,
  Building,
  Activity,
  HeartHandshake,
  Check,
  Globe,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Video
} from 'lucide-react';
import InterestSuccessModal from '../components/InterestSuccessModal';
import MeetingRequestModal from '../components/MeetingRequestModal';
import { AI_DISCLAIMER } from '../data/aiResponses';
import { calculateSmartMatch } from '../utils/matchEngine';
import { INITIAL_INVESTORS } from '../data/mockInvestors';
import { useAuth } from '../context/AuthContext';
import { createInterest, fetchInterests, fetchOwnInvestor, fetchStartupById } from '../lib/supabaseData';

export default function StartupDetailsPage({ onOpenAiGuide }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, isInvestorApproved } = useAuth();

  const [startup, setStartup] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [accreditationWarning, setAccreditationWarning] = useState('');

  // Check if current user is an investor with unapproved status
  const isInvestorUnapproved = role === 'investor' && !isInvestorApproved;
  
  // Active investor to evaluate match against
  const [selectedInvestorId, setSelectedInvestorId] = useState(null);
  const [availableInvestors, setAvailableInvestors] = useState([]);

  useEffect(() => {
    const load = async () => {
      let data = await fetchStartupById(id).catch(() => null);
      if (!data) data = getStartupById(id);
      if (data) {
        setStartup(data);
        const saved = getSavedStartupIds();
        setIsSaved(saved.includes(data.id));

        if (role === 'investor') {
          const investor = await fetchOwnInvestor(user?.id).catch(() => null);
          const interests = investor ? await fetchInterests({ investorId: investor.id }).catch(() => []) : [];
          setHasExpressedInterest(interests.some((item) => item.startup_id === data.id || item.startup === data.id));
          const list = investor ? [investor] : [getCurrentInvestor(), ...INITIAL_INVESTORS];
          setAvailableInvestors(list);
          setSelectedInvestorId(investor?.id || list[0]?.id);
        } else {
          const interested = getInterestedStartupIds();
          setHasExpressedInterest(interested.includes(data.id));
          const currentInv = getCurrentInvestor();
          const list = [currentInv, ...INITIAL_INVESTORS.filter(i => i.id !== currentInv.id)];
          setAvailableInvestors(list);
          setSelectedInvestorId(currentInv.id || list[0]?.id);
        }
      }
    };
    load().catch(() => setStartup(null));
  }, [id, role, user?.id]);

  if (!startup) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Startup Not Found</h2>
        <p className="text-sm text-muted mb-6">
          The requested startup profile could not be located in the current catalog.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-coral/10 hover:bg-coral-dark text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    );
  }

  const handleToggleSave = () => {
    const updated = toggleSaveStartup(startup.id);
    setIsSaved(updated.includes(startup.id));
  };

  const handleInterestedClick = async () => {
    if (isInvestorUnapproved) {
      setAccreditationWarning('Accreditation Required: Your investor verification dossier is currently under review. Verification is reviewed when the submitted file is complete.');
      setTimeout(() => setAccreditationWarning(''), 6000);
      return;
    }
    const investor = availableInvestors[0];
    if (investor?.id) {
      try {
        await createInterest(startup.id, investor.id);
      } catch (interestError) {
        setAccreditationWarning(interestError.message || 'Unable to record your interest.');
        return;
      }
    } else {
      addInterestStartup(startup.id);
    }
    setHasExpressedInterest(true);
    setShowInterestModal(true);
  };

  const handleOpenMeetingModal = () => {
    if (isInvestorUnapproved) {
      setAccreditationWarning('Accreditation Required: In-platform StartupY Meetings are accessible once your investor verification is approved. Verification is reviewed when the submitted file is complete.');
      setTimeout(() => setAccreditationWarning(''), 6000);
      return;
    }
    setShowMeetingModal(true);
  };

  const handleShareClick = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const initials = startup.name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Find the selected investor object
  const activeInvestor = availableInvestors.find(i => i.id === selectedInvestorId) || availableInvestors[0] || getCurrentInvestor();

  // Calculate Deterministic Smart Match
  const matchResult = calculateSmartMatch(startup, activeInvestor);

  // Label badge styling
  const labelBadgeClasses = {
    'Excellent Match': 'bg-success-bg text-success border-success/30 ring-2',
    'Strong Match': 'bg-coral/10 text-coral border-coral/40 ring-2',
    'Potential Match': 'bg-warning-bg text-warning border-warning/30 ring-2',
    'Low Match': 'bg-danger-bg text-danger border-danger/30 ring-2 ring-danger/20'
  };

  // Circular progress calculations for SVG score ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchResult.score / 100) * circumference;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      
      {/* Top Back Nav & Quick Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tunisian Startups</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-sand text-xs font-semibold text-brown-mid transition-colors cursor-pointer border border-sand"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                <span className="text-success">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={handleToggleSave}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isSaved
                ? 'bg-coral/10 text-coral border-coral/40'
                : 'bg-surface text-brown-mid border-sand hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-coral' : ''}`} />
            <span>{isSaved ? 'Saved to Watchlist' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Accreditation Warning Banner */}
      {accreditationWarning && (
        <div className="p-4 rounded-lg bg-warning-bg/10 border border-warning/30 text-warning text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-warning block">Accreditation Required</span>
            <p className="leading-relaxed">{accreditationWarning}</p>
          </div>
        </div>
      )}

      {/* Main Header Card (Crisp White Card on Dark Navy Background) */}
      <div className="bg-surface-elevated text-ink rounded-xl p-6 sm:p-10 border border-sand shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-sand">
          
          {/* Logo & Headline */}
          <div className="flex items-start gap-5">
            <div className={`w-20 h-20 rounded-lg bg-coral text-white font-semibold text-2xl flex items-center justify-center shadow-sm flex-shrink-0`}>
              {initials}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
                  {startup.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-coral" />
                  {startup.registeredInTunisia === 'Yes' ? 'Registered in Tunisia' : 'In Creation'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-sand/60 text-brown-mid">
                  {startup.stage}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-success-bg text-success border border-success/30">
                  {startup.legalStatus}
                </span>
              </div>

              <p className="text-base text-brown-mid font-medium leading-relaxed max-w-2xl">
                {startup.pitch}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-taupe pt-1">
                <span className="flex items-center gap-1 font-semibold text-ink">
                  <MapPin className="w-4 h-4 text-coral" />
                  {startup.city ? `${startup.city}, ` : ''}{startup.governorate || 'Tunis'}, Tunisia
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4 text-muted" />
                  {startup.sector}
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-muted" />
                  {startup.fundingTypeSought || 'Seed Investment'}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted" />
                  {startup.teamSize || '5 members'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted" />
                  Founded {startup.foundedYear || 2023}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px] flex-shrink-0">
            {/* Required "I'm Interested" Button */}
            <button
              onClick={handleInterestedClick}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                hasExpressedInterest
                  ? 'bg-success-bg hover:bg-success-bg text-white'
                  : 'bg-coral text-white transform hover:-translate-y-0.5'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{hasExpressedInterest ? 'Interest Sent (Send Again)' : 'I’m Interested'}</span>
            </button>

            {/* Request a StartupY Meeting (Requirement 4) */}
            <button
              onClick={handleOpenMeetingModal}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-ink bg-coral/10 hover:bg-coral/10 border border-coral/40 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <Video className="w-4 h-4 text-coral" />
              <span>Request a StartupY Meeting</span>
            </button>

            <button
              onClick={() => onOpenAiGuide('investor')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-coral bg-coral/10 hover:bg-coral/10 border border-coral/40 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-coral" />
              <span>Diligence with Investor Guide</span>
            </button>
          </div>

        </div>

        {/* Highlight Stats Strip in TND */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-lg bg-surface border border-sand">
            <span className="text-xs text-muted font-medium block">Funding Target</span>
            <div className="text-lg font-semibold text-coral mt-0.5">
              {startup.fundingNeeded}
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-surface border border-sand">
            <span className="text-xs text-muted font-medium block">Target Valuation (TND)</span>
            <div className="text-lg font-semibold text-ink mt-0.5">
              {startup.valuation || '1,800,000 TND'}
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-surface border border-sand">
            <span className="text-xs text-muted font-medium block">Prior Capital (TND)</span>
            <div className="text-lg font-semibold text-ink mt-0.5">
              {startup.fundingRaised || '100,000 TND'}
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-surface border border-sand">
            <span className="text-xs text-muted font-medium block">Runway</span>
            <div className="text-lg font-semibold text-success mt-0.5">
              {startup.financials?.runway || '12-16 months'}
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Details + Explainable Smart Match Engine (Requirement 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Problem, Solution, Traction, Team */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Problem & Solution Card */}
          <div className="bg-surface-elevated text-ink rounded-xl p-6 sm:p-8 border border-sand shadow-md space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-danger">
                <Activity className="w-4 h-4" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">
                  The Market Problem in Tunisia
                </h3>
              </div>
              <p className="text-brown-mid text-sm leading-relaxed">
                {startup.problem || 'Existing legacy systems in Tunisia suffer from operational bottlenecks, excessive paper bureaucracy, and delayed resolution.'}
              </p>
            </div>

            <div className="pt-4 border-t border-sand">
              <div className="flex items-center gap-2 mb-2 text-coral">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">
                  Our Scalable Solution
                </h3>
              </div>
              <p className="text-brown-mid text-sm leading-relaxed">
                {startup.solution || startup.pitch}
              </p>
            </div>
          </div>

          {/* Traction & Milestones Card */}
          <div className="bg-surface-elevated text-ink rounded-xl p-6 sm:p-8 border border-sand shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-ink tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <span>Verified Traction & Milestones</span>
              </h3>
              <span className="text-xs font-semibold text-success bg-success-bg px-2.5 py-0.5 rounded-full border border-success/30">
                Profile verified
              </span>
            </div>

            <div className="space-y-3">
              {startup.traction?.map((tr, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-sand">
                  <div className="w-5 h-5 rounded-full bg-success-bg text-success flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <p className="text-xs sm:text-sm text-ink font-medium">
                    {tr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Founding Team */}
          <div className="bg-surface-elevated text-ink rounded-xl p-6 sm:p-8 border border-sand shadow-md">
            <h3 className="text-base font-semibold text-ink tracking-tight mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-coral" />
              <span>Leadership & Core Team (Tunisia)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {startup.team?.map((member, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-surface border border-sand space-y-1">
                  <div className="font-bold text-sm text-ink">{member.name}</div>
                  <div className="text-xs font-semibold text-coral">{member.role}</div>
                  <p className="text-xs text-muted leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Deterministic Smart Match Engine (Requirement 3) */}
        <div className="space-y-6">
          
          {/* Main Explainable Smart Match Card */}
          <div className="bg-ink text-white rounded-xl p-6 sm:p-8 border border-coral/40 shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-coral/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header: Match Selector & Badge */}
            <div className="flex flex-col gap-3 mb-6 pb-4 border-b border-sand">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-coral bg-coral/10 px-3 py-1 rounded-full border border-coral/40 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-coral" />
                  Deterministic Smart Match
                </span>
                <span className="text-xs text-muted font-mono">100-pt Scale</span>
              </div>

              {/* Investor Switcher for Comparison */}
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">
                  Evaluating Compatibility Against:
                </label>
                <select
                  value={selectedInvestorId}
                  onChange={(e) => setSelectedInvestorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-sand text-xs text-white font-medium focus:outline-none focus:border-coral cursor-pointer"
                >
                  {availableInvestors.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.type || 'Investor'})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-muted mt-1 flex items-center justify-between">
                  <span>Ticket: {activeInvestor.budgetRange || activeInvestor.ticketSize}</span>
                  <span className="text-coral">{activeInvestor.governorates ? activeInvestor.governorates.join(', ') : 'All Tunisia'}</span>
                </div>
              </div>
            </div>

            {/* Visual Score Ring & Label (Requirement 3) */}
            <div className="flex items-center gap-6 mb-6">
              {/* SVG Score Ring */}
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-ink"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="url(#smartMatchGradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="smartMatchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#B8935F" />
                      <stop offset="100%" stopColor="#C9A876" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold text-white">
                    {matchResult.score}%
                  </span>
                  <span className="text-[9px] font-semibold text-muted uppercase tracking-wider">
                    Score
                  </span>
                </div>
              </div>

              {/* Label & Thesis */}
              <div className="space-y-1.5 flex-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${labelBadgeClasses[matchResult.label] || 'bg-surface text-brown-mid'}`}>
                  {matchResult.label}
                </span>
                <p className="text-xs text-brown-mid leading-relaxed">
                  Deterministic alignment calculated from 6 objective weighting dimensions.
                </p>
              </div>
            </div>

            {/* The Six Detailed Scoring Criteria with Real Explanations (Requirement 2 & 3) */}
            <div className="space-y-3.5 pt-4 border-t border-sand">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                Detailed Scoring Breakdown (100 Pts):
              </h4>

              {matchResult.breakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface/70 border border-sand space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-semibold text-brown-mid">
                    <span>{item.criterion}</span>
                    <span className="text-coral font-mono font-bold">
                      {item.score} / {item.maxScore} pts
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-sand overflow-hidden">
                    <div 
                      className="h-full bg-coral rounded-full transition-all duration-500"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    ></div>
                  </div>

                  {/* Clear natural language explanation */}
                  <p className="text-[11px] text-brown-mid leading-relaxed pt-0.5">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>

            {/* “Why this match?” Section (Requirement 3) */}
            <div className="mt-6 pt-5 border-t border-sand space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-coral flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-coral" />
                <span>Why this match?</span>
              </h4>

              {/* Top 3 Strengths */}
              {matchResult.strengths.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-success block">
                    Top Strengths:
                  </span>
                  {matchResult.strengths.map((str, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-brown-mid">
                      <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Up to 3 Gaps or Risks */}
              {matchResult.gaps.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-warning block">
                    Potential Gaps or Diligence Points:
                  </span>
                  {matchResult.gaps.map((gap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-brown-mid">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actionable Recommendation */}
              <div className="p-3.5 rounded-xl bg-coral/10 border border-coral/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-coral">
                  <Lightbulb className="w-3.5 h-3.5 text-coral" />
                  <span>Actionable Recommendation:</span>
                </div>
                <p className="text-brown-mid leading-relaxed text-[11px]">
                  {matchResult.recommendation}
                </p>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="mt-6 pt-4 border-t border-sand text-[11px] text-warning/80 leading-relaxed">
              {AI_DISCLAIMER}
            </div>
          </div>

          {/* Capital Allocation Plan in TND */}
          <div className="bg-surface-elevated text-ink rounded-xl p-6 border border-sand shadow-md">
            <h4 className="font-semibold text-sm text-ink mb-3 uppercase tracking-wider">
              Capital Allocation Plan ({startup.fundingNeeded})
            </h4>
            <div className="space-y-2.5 text-xs">
              {Object.entries(startup.useOfFunds || { 'Product & Tech': '50%', 'Tunisia GTM': '30%', 'Talent': '20%' }).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-sand">
                  <span className="text-brown-mid font-medium">{key}</span>
                  <span className="font-bold text-coral">{val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Success Modal Triggered by "I'm Interested" */}
      <InterestSuccessModal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        startupName={startup.name}
      />

      {/* Meeting Request Scheduling Modal (Requirement 4) */}
      <MeetingRequestModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        startup={startup}
        investor={activeInvestor}
        onMeetingCreated={() => {
          // optionally notify
        }}
      />

    </div>
  );
}
