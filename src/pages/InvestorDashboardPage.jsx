import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Sparkles, 
  Bookmark, 
  ArrowRight, 
  Coins, 
  Layers, 
  MapPin, 
  Trash2, 
  HeartHandshake, 
  Compass, 
  Edit, 
  Building2, 
  PieChart, 
  CheckCircle2, 
  Check, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { 
  getCurrentInvestor, 
  getAllStartups, 
  getSavedStartupIds, 
  toggleSaveStartup,
  addInterestStartup,
  getInterestedStartupIds
} from '../utils/storage';
import { calculateSmartMatch } from '../utils/matchEngine';
import InterestSuccessModal from '../components/InterestSuccessModal';

export default function InvestorDashboardPage({ onOpenAiGuide }) {
  const navigate = useNavigate();
  // Synchronously initialize from storage so initial render has data immediately
  const [investor, setInvestor] = useState(() => getCurrentInvestor());
  const [allStartups, setAllStartups] = useState(() => getAllStartups());
  const [savedIds, setSavedIds] = useState(() => getSavedStartupIds());
  const [interestedIds, setInterestedIds] = useState(() => getInterestedStartupIds());
  const [activeInterestStartup, setActiveInterestStartup] = useState(null);
  const [showInterestModal, setShowInterestModal] = useState(false);
  
  // Match tier filter for recommendations (Requirement 4)
  const [matchFilter, setMatchFilter] = useState('All'); // 'All' | 'Excellent Match' | 'Strong Match' | 'Potential Match'

  useEffect(() => {
    setInvestor(getCurrentInvestor());
    setAllStartups(getAllStartups());
    setSavedIds(getSavedStartupIds());
    setInterestedIds(getInterestedStartupIds());
  }, []);

  const handleRemoveSaved = (id) => {
    const updated = toggleSaveStartup(id);
    setSavedIds(updated);
  };

  const handleSendInterest = (startup) => {
    addInterestStartup(startup.id);
    setInterestedIds(prev => [...prev, startup.id]);
    setActiveInterestStartup(startup);
    setShowInterestModal(true);
  };

  if (!investor) return null;

  // Filter saved startups
  const savedStartups = allStartups.filter(s => savedIds.includes(s.id));

  // Compute deterministic Smart Match for all non-saved startups (Requirement 4)
  const evaluatedStartups = useMemo(() => {
    return allStartups
      .filter(s => !savedIds.includes(s.id))
      .map(s => {
        const match = calculateSmartMatch(s, investor);
        return {
          ...s,
          smartMatch: match
        };
      })
      .sort((a, b) => b.smartMatch.score - a.smartMatch.score);
  }, [allStartups, savedIds, investor]);

  // Apply match tier filter
  const filteredRecommendations = useMemo(() => {
    if (matchFilter === 'All') return evaluatedStartups;
    return evaluatedStartups.filter(s => s.smartMatch.label === matchFilter);
  }, [evaluatedStartups, matchFilter]);

  const labelBadgeClasses = {
    'Excellent Match': 'bg-emerald-50 text-emerald-700 border-emerald-300',
    'Strong Match': 'bg-blue-50 text-blue-700 border-blue-300',
    'Potential Match': 'bg-amber-50 text-amber-700 border-amber-300',
    'Low Match': 'bg-rose-50 text-rose-700 border-rose-300'
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Prominent Demo Scenario Card (Requirement 6) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-violet-900/60 border border-blue-500/50 p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
            <Flame className="w-6 h-6 animate-pulse text-amber-300" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800">
              Interactive Demo Scenario
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Demo: AgriSmart Tunisia is seeking 450,000 TND for Seed Investment in Sfax. Compare it with compatible investors and see why the match is recommended.
            </h3>
            <p className="text-xs text-slate-300">
              Click below to explore the exact 6-criteria scoring breakdown, top strengths, and due diligence points calculated by the Smart Match Engine.
            </p>
          </div>
        </div>

        <Link
          to="/startup/agrismart-tunisia"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-600/30 transition-all cursor-pointer transform hover:scale-105"
        >
          <span>Evaluate AgriSmart Match</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/60 text-xs font-semibold text-violet-400 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tunisian Investor & Angel Portal</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Deterministic Match Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Investor Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deterministic deal flow sorted by calculated compatibility in TND against your mandate.
          </p>
        </div>

        {/* Required Button: “Ask Investor Tunisia Guide” */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAiGuide('investor')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-violet-200 animate-pulse" />
            <span>Ask Investor Tunisia Guide</span>
          </button>

          <Link
            to="/onboarding/investor"
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Update Mandate</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Saved Startups */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Saved in Watchlist</span>
            <Bookmark className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
            {savedStartups.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Tunisian startups under review
          </div>
        </div>

        {/* KPI 2: Deals Evaluated */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Deals Screened (TND)</span>
            <PieChart className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {allStartups.length}
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            Ranked by Smart Match Engine
          </div>
        </div>

        {/* KPI 3: Top Calculated Match */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Deal Match</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {evaluatedStartups[0]?.smartMatch?.score || 95}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {evaluatedStartups[0]?.name || 'AgriSmart Tunisia'}
          </div>
        </div>

        {/* KPI 4: Pending Intro Calls */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inbounds</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {interestedIds.length || 2}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Founders reviewing mandate
          </div>
        </div>

      </div>

      {/* Profile Summary Card (Crisp White Card on Dark Navy Background) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-violet-600/30">
              {investor.name ? investor.name.slice(0, 2).toUpperCase() : 'TN'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {investor.name}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  {investor.type || 'Angel Investor'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {investor.firm || 'Tunisia Syndicate'}
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
                {investor.bio || 'Deploying smart capital in Tunisian Dinars across high-potential Tunisian founders and university spin-offs.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore All Deals</span>
            </Link>
          </div>

        </div>

        {/* Profile Mandate Strip in TND */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Ticket Size in TND</span>
            <span className="font-bold text-violet-700 text-sm mt-0.5 block">
              {investor.budgetRange || '100,000 - 500,000 TND'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Investment Type</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {investor.investmentType || 'Equity'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Preferred Governorates</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {investor.region || 'Tunis, Sfax, Sousse'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Target Sectors</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(investor.focus || ['AgriTech', 'FinTech', 'AI / SaaS']).map((sec) => (
                <span key={sec} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                  {sec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Saved Startups (Watchlist) + Recommended Matches Sorted by Calculated Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Saved Startups (Watchlist) */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-400" />
                <span>Saved Tunisian Startups</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Companies you bookmarked for diligence review.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-300 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-800">
              {savedStartups.length} Saved
            </span>
          </div>

          <div className="space-y-4">
            {savedStartups.length > 0 ? (
              savedStartups.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.logoBg || 'from-blue-600 to-indigo-600'} text-white font-extrabold text-sm flex items-center justify-center shadow-md`}>
                        {s.name.replace(/\(.*?\)/g, '').trim().slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{s.name}</h4>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{s.sector}</span>
                          <span>•</span>
                          <span className="text-blue-400">{s.governorate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveSaved(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {s.pitch}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                    <span className="font-bold text-blue-400">Seeking {s.fundingNeeded}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendInterest(s)}
                        className="px-3 py-1.5 rounded-lg font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>I’m Interested</span>
                      </button>

                      <Link
                        to={`/startup/${s.id}`}
                        className="px-3 py-1.5 rounded-lg font-medium text-xs text-slate-300 bg-slate-700/80 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm space-y-3">
                <p>Your watchlist is currently empty.</p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Browse Startups in Tunisia</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Recommended Matches with Calculated Score & Match Tier Filter (Requirement 4) */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span>Smart Match Recommendations</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Deterministic scores calculated against your mandate.
              </p>
            </div>
            
            {/* Filter: Excellent Match / Strong Match / Potential Match (Requirement 4) */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {['All', 'Excellent Match', 'Strong Match', 'Potential Match'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setMatchFilter(tier)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    matchFilter === tier
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tier === 'All' ? 'All Tiers' : tier.replace(' Match', '')}
                </button>
              ))}
            </div>
          </div>

          {/* List of recommended startups */}
          <div className="space-y-4">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.slice(0, 4).map((s) => {
                const match = s.smartMatch;
                const topReason = match.strengths[0] || match.breakdown[0]?.explanation;

                return (
                  <div 
                    key={s.id} 
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-violet-500/50 transition-all cursor-pointer group"
                    onClick={() => navigate(`/startup/${s.id}`)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.logoBg || 'from-indigo-600 to-violet-600'} text-white font-extrabold text-sm flex items-center justify-center shadow-md`}>
                          {s.name.replace(/\(.*?\)/g, '').trim().slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                              {s.name}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${labelBadgeClasses[match.label] || 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                              {match.score}% • {match.label}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {s.sector} • <span className="text-slate-300 font-medium">{s.stage}</span> • <span className="text-blue-400">{s.governorate}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                        {s.fundingNeeded}
                      </span>
                    </div>

                    {/* Short reason on every card (Requirement 4) */}
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <strong>Match Factor:</strong> {topReason}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-xs">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>Vehicle:</span>
                        <strong className="text-slate-300">{s.fundingTypeSought || 'Seed'}</strong>
                      </span>
                      
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSendInterest(s)}
                          className="px-3 py-1.5 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>I’m Interested</span>
                        </button>

                        <Link
                          to={`/startup/${s.id}`}
                          className="px-3 py-1.5 rounded-lg font-medium text-xs text-slate-300 bg-slate-700/80 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          Match Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                No recommended startups match tier "{matchFilter}".
              </div>
            )}
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/explore"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>Explore all Tunisian deal flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Success Modal */}
      <InterestSuccessModal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        startupName={activeInterestStartup?.name}
      />

    </div>
  );
}
