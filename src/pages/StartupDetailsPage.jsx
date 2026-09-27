import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getStartupById, 
  getSavedStartupIds, 
  toggleSaveStartup, 
  addInterestStartup,
  getInterestedStartupIds 
} from '../utils/storage';
import { 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Layers, 
  Bookmark, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Calendar,
  Building,
  Activity,
  HeartHandshake,
  Check
} from 'lucide-react';
import InterestSuccessModal from '../components/InterestSuccessModal';

export default function StartupDetailsPage({ onOpenAiGuide }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [startup, setStartup] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const data = getStartupById(id);
    if (data) {
      setStartup(data);
      const saved = getSavedStartupIds();
      setIsSaved(saved.includes(data.id));

      const interested = getInterestedStartupIds();
      setHasExpressedInterest(interested.includes(data.id));
    }
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
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const matchScore = startup.aiMatchScore || 87;
  const scores = startup.aiScores || {
    sectorFit: 94,
    stageFit: 90,
    growthRate: 88,
    teamStrength: 92
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Top Back Nav & Quick Actions */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Startups</span>
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
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-2xl shadow-slate-950/40 mb-8">
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
                  Verified Deal
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                  {startup.stage}
                </span>
              </div>

              <p className="text-base text-slate-700 font-medium leading-relaxed max-w-2xl">
                {startup.pitch}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {startup.city ? `${startup.city}, ` : ''}{startup.country}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4 text-slate-400" />
                  {startup.sector}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  {startup.teamSize || '5 members'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Founded {startup.foundedYear || 2024}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px] flex-shrink-0">
            {/* Primary Required "I'm Interested" Button */}
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
              <span>Diligence with AI Guide</span>
            </button>
          </div>

        </div>

        {/* Highlight Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block">Funding Target</span>
            <div className="text-lg font-black text-slate-900 mt-0.5 text-blue-600">
              {startup.fundingNeeded}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block">Target Valuation</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {startup.valuation || '$9.0M Post'}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block">Prior Capital</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {startup.fundingRaised || '$350,000'}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block">Runway</span>
            <div className="text-lg font-black text-slate-900 mt-0.5 text-emerald-600">
              {startup.financials?.runway || '14 months'}
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Details + AI Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Problem, Solution, Traction, Team */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Problem & Solution Card */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-rose-600">
                <Activity className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  The Market Problem
                </h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {startup.problem || 'Current enterprise legacy solutions suffer from high latency, disconnected data silos, and severe labor overhead.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2 text-blue-600">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Our Proprietary Solution
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
                Data Room Verified
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
              <span>Leadership & Core Team</span>
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

        {/* Right Column (1 Col): AI Match Score Card (PROMINENTLY FEATURED) */}
        <div className="space-y-6">
          
          {/* AI Match Score Card */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] text-white rounded-3xl p-6 sm:p-8 border border-violet-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300 bg-violet-950/80 px-3 py-1 rounded-full border border-violet-700/50 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                Algorithmic Diligence
              </span>
              <span className="text-xs text-slate-400 font-mono">v3.2 AI</span>
            </div>

            {/* Score Ring / Number */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
                {matchScore}%
              </span>
              <span className="text-sm font-bold text-slate-300">
                AI Match Score
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {startup.aiThesis || 'High-conviction alignment with institutional investment criteria based on team defensibility, market velocity, and unit economics.'}
            </p>

            {/* Breakdown Bars */}
            <div className="space-y-3.5 pt-4 border-t border-slate-700/60">
              
              <div>
                <div className="flex justify-between text-xs font-medium mb-1 text-slate-300">
                  <span>Sector Alignment</span>
                  <span className="font-bold text-blue-400">{scores.sectorFit}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    style={{ width: `${scores.sectorFit}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1 text-slate-300">
                  <span>Stage & Valuation Fit</span>
                  <span className="font-bold text-indigo-400">{scores.stageFit}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                    style={{ width: `${scores.stageFit}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1 text-slate-300">
                  <span>Growth Velocity</span>
                  <span className="font-bold text-violet-400">{scores.growthRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full"
                    style={{ width: `${scores.growthRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1 text-slate-300">
                  <span>Team Defensibility</span>
                  <span className="font-bold text-emerald-400">{scores.teamStrength}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${scores.teamStrength}%` }}
                  ></div>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Benchmark: Top 8% of sector</span>
              <button 
                onClick={() => onOpenAiGuide('investor')} 
                className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer underline"
              >
                Inquire with AI
              </button>
            </div>
          </div>

          {/* Use of Funds Card */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-100 shadow-xl">
            <h4 className="font-extrabold text-sm text-slate-900 mb-3 uppercase tracking-wider">
              Capital Allocation Plan
            </h4>
            <div className="space-y-2.5 text-xs">
              {Object.entries(startup.useOfFunds || { 'R&D': '50%', 'GTM': '30%', 'Ops': '20%' }).map(([key, val]) => (
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
