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

export default function StartupDashboardPage({ onOpenAiGuide }) {
  const location = useLocation();
  const [profile, setProfile] = useState(() => getCurrentStartup());
  const [investorRequests, setInvestorRequests] = useState(MOCK_INTERESTED_REQUESTS);
  const [requestedIntros, setRequestedIntros] = useState({});
  const [notification, setNotification] = useState('');
  
  // State for "View Match Details" Modal (Requirement 5)
  const [selectedMatchInvestor, setSelectedMatchInvestor] = useState(null);

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

  // Evaluate and sort suggested investors by deterministic match score (Requirement 5)
  const rankedInvestors = useMemo(() => {
    if (!profile) return INITIAL_INVESTORS;

    return INITIAL_INVESTORS.map(inv => {
      const match = calculateSmartMatch(profile, inv);
      return {
        ...inv,
        smartMatch: match
      };
    }).sort((a, b) => b.smartMatch.score - a.smartMatch.score);
  }, [profile]);

  if (!profile) return null;

  const interestedCount = (profile.interestedInvestorsCount || 6) + investorRequests.length;

  const labelBadgeClasses = {
    'Excellent Match': 'bg-emerald-50 text-emerald-700 border-emerald-300',
    'Strong Match': 'bg-blue-50 text-blue-700 border-blue-300',
    'Potential Match': 'bg-amber-50 text-amber-700 border-amber-300',
    'Low Match': 'bg-rose-50 text-rose-700 border-rose-300'
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Access Denied Warning Banner */}
      {location.state?.accessDenied && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm font-semibold flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{location.state.message || "Access denied. You do not have permission to view this page."}</span>
        </div>
      )}

      {/* Top Banner / Notification */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center justify-between animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Prominent Demo Scenario Card (Requirement 6) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-violet-900/60 border border-blue-500/50 p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
            <Flame className="w-6 h-6 animate-pulse text-amber-300" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800">
              Deterministic Demo Scenario
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Demo: AgriSmart Tunisia is seeking 450,000 TND for Seed Investment in Sfax. Compare it with compatible investors and see why the match is recommended.
            </h3>
            <p className="text-xs text-slate-300">
              The Smart Match Engine computes exact compatibility across sectors, ticket size in TND, stage, governorate, and funding vehicle.
            </p>
          </div>
        </div>

        <Link
          to="/startup/agrismart-tunisia"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-600/30 transition-all cursor-pointer transform hover:scale-105"
        >
          <span>Evaluate Match Breakdown</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-xs font-semibold text-blue-400 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Tunisian Founder Portal</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Deterministic Match Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Startup Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track interested investors in TND and explore deterministic compatibility scores.
          </p>
        </div>

        {/* Required Button: “Ask Startup Tunisia Guide” */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAiGuide('startup')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-violet-200 animate-pulse" />
            <span>Ask Startup Tunisia Guide</span>
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
            <span>+{investorRequests.length} active inbounds</span>
          </div>
        </div>

        {/* KPI 2: Profile Views */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Investor Views</span>
            <Eye className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">
            184
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Angels & funds in Tunisia
          </div>
        </div>

        {/* KPI 3: AI Readiness Score */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Highest Investor Fit</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {rankedInvestors[0]?.smartMatch?.score || 95}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {rankedInvestors[0]?.name}
          </div>
        </div>

        {/* KPI 4: Avg Response Speed */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Intro Speed</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            24h
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Tunis & coastal networks
          </div>
        </div>

      </div>

      {/* Profile Summary Card (Crisp White Card on Dark Navy Background) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'TN'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {profile.name || 'AgriSmart Tunisia (Demo)'}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {profile.stage || 'Early Revenue'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {profile.legalStatus || 'SARL'}
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
                {profile.pitch || 'Precision drip irrigation IoT telemetry optimizing water and olive crop yields across Sfax.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/startup/${profile.id || 'agrismart-tunisia'}`}
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
              {profile.sector || 'AgriTech'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Funding Target (TND)</span>
            <span className="font-bold text-blue-600 text-sm mt-0.5 block">
              {profile.fundingNeeded || '450,000 TND'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Governorate</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {profile.governorate || 'Sfax'}, Tunisia
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Funding Type Sought</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {profile.fundingTypeSought || 'Seed Investment'}
            </span>
          </div>
        </div>
      </div>

      {/* 11-Step Startup Roadmap Engine (Requirement 4) */}
      <StartupRoadmap
        onOpenAiGuide={onOpenAiGuide}
      />

      {/* Bidaya Meeting Center (Requirements 4, 6, 7, 8) */}
      <MeetingCenter
        role="startup"
        currentId={profile?.id || 'agrismart-tunisia'}
        onOpenAiGuide={onOpenAiGuide}
      />

      {/* Two Column Grid: Inbound Investor Requests + Suggested Investor Matches Sorted by Calculated Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Inbound Investor Requests */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Interested Investors Inbound</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Investors requesting intro meetings or data room access.
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
                No pending investor inbounds. We are featuring your profile to Tunisian angel syndicates.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Suggested Investor Matches with Real Match Scores (Requirement 5) */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span>Suggested Tunisian Investors</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sorted by deterministic compatibility against your profile.
              </p>
            </div>
            <span className="text-xs font-bold text-violet-300 bg-violet-950 px-2.5 py-1 rounded-full border border-violet-800">
              Smart Ranked
            </span>
          </div>

          <div className="space-y-4">
            {rankedInvestors.map((inv) => {
              const requested = requestedIntros[inv.id];
              const match = inv.smartMatch;

              return (
                <div key={inv.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{inv.name}</h4>
                        {/* Show Compatibility Score and Label (Requirement 5) */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${labelBadgeClasses[match?.label || 'Potential Match']}`}>
                          {match?.score || 85}% • {match?.label || 'Fit'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {inv.partner} • {inv.type}
                      </div>
                    </div>

                    {/* Show Ticket Range (Requirement 5) */}
                    <span className="text-xs font-bold text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                      {inv.ticketSize || inv.budgetRange}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {inv.thesis}
                  </p>

                  {/* Show Focus Sectors (Requirement 5) */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Focus Sectors:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {(inv.sectors || inv.focus || []).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    {/* View Match Details Action (Requirement 5) */}
                    <button
                      onClick={() => setSelectedMatchInvestor(inv)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      <span>View Match Details</span>
                    </button>

                    <button
                      onClick={() => handleRequestIntro(inv.id, inv.name)}
                      disabled={requested}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedMatchInvestor(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 bg-violet-950 px-2.5 py-0.5 rounded-full border border-violet-800">
                  Smart Match Evaluation
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${labelBadgeClasses[selectedMatchInvestor.smartMatch?.label]}`}>
                  {selectedMatchInvestor.smartMatch?.score}% • {selectedMatchInvestor.smartMatch?.label}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Match Details: {profile.name} × {selectedMatchInvestor.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ticket Range: {selectedMatchInvestor.ticketSize || selectedMatchInvestor.budgetRange} • Focus: {(selectedMatchInvestor.sectors || selectedMatchInvestor.focus || []).join(', ')}
              </p>
            </div>

            {/* 6 Criteria Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Criteria Breakdown (100 Pts):
              </h4>
              {selectedMatchInvestor.smartMatch?.breakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-200">{item.criterion}</span>
                    <span className="text-blue-400 font-mono">{item.score} / {item.maxScore} pts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>

            {/* Strengths & Recommendation */}
            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <h5 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] mb-1">
                  Key Strengths:
                </h5>
                <ul className="space-y-1">
                  {selectedMatchInvestor.smartMatch?.strengths.map((str, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/70 border border-blue-800/60 text-blue-200">
                <strong>Recommendation:</strong> {selectedMatchInvestor.smartMatch?.recommendation}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedMatchInvestor(null)}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
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
