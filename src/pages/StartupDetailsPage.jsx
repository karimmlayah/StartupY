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
  ArrowRight
} from 'lucide-react';
import InterestSuccessModal from '../components/InterestSuccessModal';
import { AI_DISCLAIMER } from '../data/aiResponses';
import { calculateSmartMatch } from '../utils/matchEngine';
import { INITIAL_INVESTORS } from '../data/mockInvestors';

export default function StartupDetailsPage({ onOpenAiGuide }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [startup, setStartup] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  
  // Active investor to evaluate match against
  const [selectedInvestorId, setSelectedInvestorId] = useState(null);
  const [availableInvestors, setAvailableInvestors] = useState([]);

  useEffect(() => {
    const data = getStartupById(id);
    if (data) {
      setStartup(data);
      const saved = getSavedStartupIds();
      setIsSaved(saved.includes(data.id));

      const interested = getInterestedStartupIds();
      setHasExpressedInterest(interested.includes(data.id));
    }

    const currentInv = getCurrentInvestor();
    // Merge current investor with INITIAL_INVESTORS
    const list = [currentInv, ...INITIAL_INVESTORS.filter(i => i.id !== currentInv.id)];
    setAvailableInvestors(list);
    setSelectedInvestorId(currentInv.id || list[0].id);
  }, [id]);

  if (!startup) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Startup Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested startup profile could not be located in the current catalog.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 text-sm"
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

  const handleInterestedClick = () => {
    addInterestStartup(startup.id);
    setHasExpressedInterest(true);
    setShowInterestModal(true);
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
    'Excellent Match': 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20',
    'Strong Match': 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500/20',
    'Potential Match': 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-500/20',
    'Low Match': 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/20'
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
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tunisian Startups</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer border border-slate-700"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
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
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-400' : ''}`} />
            <span>{isSaved ? 'Saved to Watchlist' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Card (Crisp White Card on Dark Navy Background) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-slate-100">
          
          {/* Logo & Headline */}
          <div className="flex items-start gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${startup.logoBg || 'from-blue-600 to-indigo-600'} text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-600/25 flex-shrink-0`}>
              {initials}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {startup.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  {startup.registeredInTunisia === 'Yes' ? 'Registered in Tunisia' : 'In Creation'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                  {startup.stage}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {startup.legalStatus}
                </span>
              </div>

              <p className="text-base text-slate-700 font-medium leading-relaxed max-w-2xl">
                {startup.pitch}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {startup.city ? `${startup.city}, ` : ''}{startup.governorate || 'Tunis'}, Tunisia
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4 text-slate-400" />
                  {startup.sector}
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-slate-400" />
                  {startup.fundingTypeSought || 'Seed Investment'}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  {startup.teamSize || '5 members'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
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
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer ${
                hasExpressedInterest
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-blue-600/30 transform hover:-translate-y-0.5'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{hasExpressedInterest ? 'Interest Sent (Send Again)' : 'I’m Interested'}</span>
            </button>

            <button
              onClick={() => onOpenAiGuide('investor')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>Diligence with Investor Guide</span>
            </button>
          </div>

        </div>

        {/* Highlight Stats Strip in TND */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block">Funding Target</span>
            <div className="text-lg font-black text-blue-600 mt-0.5">
              {startup.fundingNeeded}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block">Target Valuation (TND)</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {startup.valuation || '1,800,000 TND'}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block">Prior Capital (TND)</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {startup.fundingRaised || '100,000 TND'}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block">Runway</span>
            <div className="text-lg font-black text-emerald-600 mt-0.5">
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
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-rose-600">
                <Activity className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  The Market Problem in Tunisia
                </h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {startup.problem || 'Existing legacy systems in Tunisia suffer from operational bottlenecks, excessive paper bureaucracy, and delayed resolution.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2 text-blue-600">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Our Scalable Solution
                </h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {startup.solution || startup.pitch}
              </p>
            </div>
          </div>

          {/* Traction & Milestones Card */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Verified Traction & Milestones</span>
              </h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Demo Verified
              </span>
            </div>

            <div className="space-y-3">
              {startup.traction?.map((tr, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium">
                    {tr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Founding Team */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Leadership & Core Team (Tunisia)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {startup.team?.map((member, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="font-bold text-sm text-slate-900">{member.name}</div>
                  <div className="text-xs font-semibold text-blue-600">{member.role}</div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
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
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] text-white rounded-3xl p-6 sm:p-8 border border-violet-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header: Match Selector & Badge */}
            <div className="flex flex-col gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 bg-violet-950/90 px-3 py-1 rounded-full border border-violet-700/60 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Deterministic Smart Match
                </span>
                <span className="text-xs text-slate-400 font-mono">100-pt Scale</span>
              </div>

              {/* Investor Switcher for Comparison */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Evaluating Compatibility Against:
                </label>
                <select
                  value={selectedInvestorId}
                  onChange={(e) => setSelectedInvestorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white font-medium focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  {availableInvestors.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.type || 'Investor'})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Ticket: {activeInvestor.budgetRange || activeInvestor.ticketSize}</span>
                  <span className="text-blue-400">{activeInvestor.governorates ? activeInvestor.governorates.join(', ') : 'All Tunisia'}</span>
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
                    className="text-slate-800"
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
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">
                    {matchResult.score}%
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    Score
                  </span>
                </div>
              </div>

              {/* Label & Thesis */}
              <div className="space-y-1.5 flex-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${labelBadgeClasses[matchResult.label] || 'bg-slate-800 text-slate-200'}`}>
                  {matchResult.label}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deterministic alignment calculated from 6 objective weighting dimensions.
                </p>
              </div>
            </div>

            {/* The Six Detailed Scoring Criteria with Real Explanations (Requirement 2 & 3) */}
            <div className="space-y-3.5 pt-4 border-t border-slate-700/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Scoring Breakdown (100 Pts):
              </h4>

              {matchResult.breakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-semibold text-slate-200">
                    <span>{item.criterion}</span>
                    <span className="text-blue-400 font-mono font-bold">
                      {item.score} / {item.maxScore} pts
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    ></div>
                  </div>

                  {/* Clear natural language explanation */}
                  <p className="text-[11px] text-slate-300 leading-relaxed pt-0.5">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>

            {/* “Why this match?” Section (Requirement 3) */}
            <div className="mt-6 pt-5 border-t border-slate-700/70 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>Why this match?</span>
              </h4>

              {/* Top 3 Strengths */}
              {matchResult.strengths.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Top Strengths:
                  </span>
                  {matchResult.strengths.map((str, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Up to 3 Gaps or Risks */}
              {matchResult.gaps.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    Potential Gaps or Diligence Points:
                  </span>
                  {matchResult.gaps.map((gap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actionable Recommendation */}
              <div className="p-3.5 rounded-xl bg-blue-950/70 border border-blue-700/60 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-300">
                  <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                  <span>Actionable Recommendation:</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {matchResult.recommendation}
                </p>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="mt-6 pt-4 border-t border-slate-700/60 text-[11px] text-amber-300/80 leading-relaxed">
              {AI_DISCLAIMER}
            </div>
          </div>

          {/* Capital Allocation Plan in TND */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-100 shadow-xl">
            <h4 className="font-extrabold text-sm text-slate-900 mb-3 uppercase tracking-wider">
              Capital Allocation Plan ({startup.fundingNeeded})
            </h4>
            <div className="space-y-2.5 text-xs">
              {Object.entries(startup.useOfFunds || { 'Product & Tech': '50%', 'Tunisia GTM': '30%', 'Talent': '20%' }).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">{key}</span>
                  <span className="font-bold text-blue-600">{val}</span>
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

    </div>
  );
}
