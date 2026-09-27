import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  BookOpen
} from 'lucide-react';
import { 
  getCurrentInvestor, 
  getAllStartups, 
  getSavedStartupIds, 
  toggleSaveStartup,
  addInterestStartup,
  getInterestedStartupIds
} from '../utils/storage';
import InterestSuccessModal from '../components/InterestSuccessModal';

export default function InvestorDashboardPage({ onOpenAiGuide }) {
  const [investor, setInvestor] = useState(null);
  const [allStartups, setAllStartups] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [interestedIds, setInterestedIds] = useState([]);
  const [activeInterestStartup, setActiveInterestStartup] = useState(null);
  const [showInterestModal, setShowInterestModal] = useState(false);

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

  const savedStartups = allStartups.filter(s => savedIds.includes(s.id));

  const recommendedStartups = allStartups
    .filter(s => !savedIds.includes(s.id))
    .sort((a, b) => (b.aiMatchScore || 85) - (a.aiMatchScore || 85))
    .slice(0, 3);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/60 text-xs font-semibold text-violet-400 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tunisian Investor & Angel Portal</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Demo Data</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Investor Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Curated deal flow in TND, regional watchlists across governorates, and AI diligence tools.
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
            28
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            Across 9 governorates
          </div>
        </div>

        {/* KPI 3: Avg AI Match Score */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Thesis Match</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            91.2%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Aligned to your ticket in TND
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
              <span>Explore Tunisian Deals</span>
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

      {/* Two Columns: Saved Startups (Watchlist) + Recommended Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Saved Startups (Watchlist) */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-400" />
                <span>Saved Tunisian Startups (Watchlist)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Companies you bookmarked for partner review in Tunisia.
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
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                            {s.aiMatchScore}% Match
                          </span>
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

        {/* Column 2: Recommended Startup Matches in Tunisia */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span>Recommended Tunisian Matches</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Top AI scoring opportunities matching your stage and TND ticket size.
              </p>
            </div>
            <span className="text-xs font-bold text-violet-300 bg-violet-950 px-2.5 py-1 rounded-full border border-violet-800">
              Top Ranked
            </span>
          </div>

          <div className="space-y-4">
            {recommendedStartups.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.logoBg || 'from-indigo-600 to-violet-600'} text-white font-extrabold text-sm flex items-center justify-center shadow-md`}>
                      {s.name.replace(/\(.*?\)/g, '').trim().slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{s.name}</h4>
                        <span className="text-[10px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                          {s.aiMatchScore}% Score
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {s.sector} • <span className="text-slate-300 font-medium">{s.stage}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                    {s.fundingNeeded}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {s.pitch}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                  <span className="text-slate-400">{s.governorate}, Tunisia</span>
                  <div className="flex items-center gap-2">
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
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
