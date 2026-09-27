import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Sparkles, 
  Users, 
  Eye, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  X, 
  DollarSign, 
  Layers, 
  MapPin, 
  Send,
  PlusCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { getCurrentStartup, getInterestedStartupIds } from '../utils/storage';
import { INITIAL_INVESTORS, MOCK_INTERESTED_REQUESTS } from '../data/mockInvestors';

export default function StartupDashboardPage({ onOpenAiGuide }) {
  const [profile, setProfile] = useState(null);
  const [investorRequests, setInvestorRequests] = useState(MOCK_INTERESTED_REQUESTS);
  const [suggestedInvestors, setSuggestedInvestors] = useState(INITIAL_INVESTORS);
  const [requestedIntros, setRequestedIntros] = useState({});
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const current = getCurrentStartup();
    setProfile(current);
  }, []);

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

  if (!profile) return null;

  // Number of interested investors: base count + dynamic requests length
  const interestedCount = (profile.interestedInvestorsCount || 6) + investorRequests.length;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner / Notification */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center justify-between animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-xs font-semibold text-blue-400 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Founder Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Startup Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time pipeline monitoring, investor inbound requests, and AI fundraising guidance.
          </p>
        </div>

        {/* Required Button: “Ask Startup AI Guide” */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAiGuide('startup')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-violet-200 animate-pulse" />
            <span>Ask Startup AI Guide</span>
          </button>

          <Link
            to="/onboarding/startup"
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Number of Interested Investors */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Interested Investors</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            {interestedCount}
          </div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <span>+{investorRequests.length} new inbounds this week</span>
          </div>
        </div>

        {/* KPI 2: Profile Views */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Investor Views</span>
            <Eye className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">
            348
          </div>
          <div className="text-xs text-slate-400 mt-1">
            28 VC partners viewed your deck
          </div>
        </div>

        {/* KPI 3: AI Readiness Score */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">AI Pitch Readiness</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            94/100
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Strong traction & unit economics
          </div>
        </div>

        {/* KPI 4: Avg Response Speed */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Intro Acceptance</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            86%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Avg. partner call in 48 hours
          </div>
        </div>

      </div>

      {/* Profile Summary Card (Crisp White Card on Dark Navy Background) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'SB'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {profile.name || 'OmniPulse AI'}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {profile.stage || 'Early Revenue'}
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
                {profile.pitch || 'Autonomous AI agent workforce for multi-channel enterprise customer operations.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/startup/${profile.id || 'omnipulse-ai'}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span>View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Profile Details Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Sector</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {profile.sector || 'AI & Machine Learning'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Funding Target</span>
            <span className="font-bold text-blue-600 text-sm mt-0.5 block">
              {profile.fundingNeeded || '$1,800,000'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Headquarters</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {profile.country || 'United States'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Team Size</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {profile.teamSize || '8 members'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Inbound Investor Requests + Suggested Investor Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Inbound Investor Requests (Number of Interested Investors) */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Interested Investors Inbound</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Investors who clicked "I'm Interested" or requested data room access.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-300 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-800">
              {investorRequests.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {investorRequests.length > 0 ? (
              investorRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${req.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-md`}>
                        {req.investorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{req.investorName}</div>
                        <div className="text-xs text-slate-400">{req.firm} • <span className="text-blue-400 font-semibold">{req.checkSize}</span></div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{req.date}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{req.note}"
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAcceptRequest(req.id, req.investorName)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept & Schedule Intro</span>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="py-2 px-3 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                No pending investor inbounds. We are featuring your profile to new syndicates.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Suggested Investor Matches */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span>Suggested Investor Matches</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Funds algorithmically matched to your sector and stage.
              </p>
            </div>
            <span className="text-xs font-bold text-violet-300 bg-violet-950 px-2.5 py-1 rounded-full border border-violet-800">
              High Fit
            </span>
          </div>

          <div className="space-y-4">
            {suggestedInvestors.map((inv) => {
              const requested = requestedIntros[inv.id];
              return (
                <div key={inv.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{inv.name}</h4>
                        <span className="text-[11px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                          {inv.matchScore}% AI Fit
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {inv.partner} • {inv.location}
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                      {inv.checkSize}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {inv.thesis}
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {inv.sectors.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleRequestIntro(inv.id, inv.name)}
                      disabled={requested}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                        requested
                          ? 'bg-slate-700 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md'
                      }`}
                    >
                      {requested ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Intro Request Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Request Curated Introduction</span>
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

    </div>
  );
}
