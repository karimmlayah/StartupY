import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Flame,
  AlertCircle
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
import MeetingCenter from '../components/MeetingCenter';
import InvestorVerificationFlow from '../components/InvestorVerificationFlow';
import { useAuth } from '../context/AuthContext';
import { createInterest, fetchApprovedStartups, fetchInterests, fetchOwnInvestor } from '../lib/supabaseData';

export default function InvestorDashboardPage({ onOpenAiGuide }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInvestorApproved } = useAuth();
  // Synchronously initialize from storage so initial render has data immediately
  const [investor, setInvestor] = useState(null);
  const [allStartups, setAllStartups] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [interestedIds, setInterestedIds] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [activeInterestStartup, setActiveInterestStartup] = useState(null);
  const [showInterestModal, setShowInterestModal] = useState(false);
  
  // Match tier filter for recommendations (Requirement 4)
  const [matchFilter, setMatchFilter] = useState('All'); // 'All' | 'Excellent Match' | 'Strong Match' | 'Potential Match'

  const loadDashboard = async () => {
    setDataLoading(true);
    setDataError('');
    try {
      const ownInvestor = await fetchOwnInvestor(user?.id).catch(() => null);
      setInvestor(ownInvestor || getCurrentInvestor());
      const [startups, interests] = await Promise.all([
        fetchApprovedStartups().catch(() => getAllStartups()),
        ownInvestor?.id ? fetchInterests({ investorId: ownInvestor.id }).catch(() => []) : Promise.resolve([]),
      ]);
      setAllStartups(startups?.length ? startups : getAllStartups());
      setInterestedIds((interests || []).map((item) => item.startup_id || item.startup));
      setSavedIds(getSavedStartupIds());
    } catch (err) {
      setDataError(err.message || 'Unable to load investor dashboard.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => { if (user?.id) loadDashboard(); }, [user?.id, isInvestorApproved]);

  const handleRemoveSaved = (id) => {
    const updated = toggleSaveStartup(id);
    setSavedIds(updated);
  };

  const handleSendInterest = async (startup) => {
    try {
      if (investor?.id) await createInterest(startup.id, investor.id).catch(() => {});
      addInterestStartup(startup.id);
      setInterestedIds(prev => [...new Set([...prev, startup.id])]);
      setActiveInterestStartup(startup);
      setShowInterestModal(true);
    } catch (err) {
      setDataError(err.message || 'Unable to record interest.');
    }
  };

  // Filter saved startups
  const savedStartups = allStartups.filter(s => savedIds.includes(s.id));

  // Compute deterministic Smart Match for all non-saved startups (Requirement 4)
  const evaluatedStartups = useMemo(() => {
    if (!investor) return [];
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

  if (dataLoading) return <div className="mx-auto max-w-7xl px-6 py-16"><div className="h-48 animate-pulse rounded-lg border border-sand bg-surface" /></div>;
  if (dataError) return <div className="mx-auto max-w-3xl px-6 py-16 text-center"><p className="text-danger">{dataError}</p><button onClick={loadDashboard} className="mt-4 rounded-md bg-coral px-4 py-2 text-sm text-white">Retry</button></div>;
  if (!investor) return <div className="mx-auto max-w-3xl px-6 py-16 text-center"><h1 className="text-3xl">Complete your investor profile</h1><p className="mt-2 text-muted">Submit your mandate before accessing verified deal flow.</p><Link to="/onboarding/investor" className="mt-5 inline-block rounded-md bg-coral px-5 py-3 text-sm text-white">Create investor profile</Link></div>;

  const labelBadgeClasses = {
    'Excellent Match': 'bg-success-bg text-success border-success/30',
    'Strong Match': 'bg-coral/10 text-coral border-coral/40',
    'Potential Match': 'bg-warning-bg text-warning border-warning/30',
    'Low Match': 'bg-danger-bg text-danger border-danger/30'
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {!isInvestorApproved && (
        <div className="rounded-lg border border-warning/30 bg-warning-bg p-5 text-sm text-warning">
          Your investor profile is awaiting approval. Deal flow and meetings will unlock after verification.
        </div>
      )}
      
      {/* Access Denied Warning Banner */}
      {location.state?.accessDenied && (
        <div className="p-4 rounded-lg bg-danger-bg0/20 border border-danger/30 text-danger text-sm font-semibold flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
          <span>{location.state.message || "Access denied. You do not have permission to view this page."}</span>
        </div>
      )}
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sand">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/40 text-xs font-semibold text-coral mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Espace investisseur</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Tableau de bord investisseur
          </h1>
          <p className="text-sm text-muted mt-1">
            Explorez le deal flow et priorisez les startups compatibles avec votre mandat.
          </p>
        </div>

        {/* Required Button: “Ask Investor Tunisia Guide” */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAiGuide('investor')}
            className="flex items-center gap-2 rounded-md bg-coral px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-px hover:bg-coral-dark hover:shadow-md"
          >
            <Sparkles className="size-4" />
            <span>Demander au guide IA</span>
          </button>

          <Link
            to="/onboarding/investor"
            className="flex items-center gap-1.5 rounded-md border border-sand bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-coral/40"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier le mandat</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        
        {/* KPI 1: Saved Startups */}
        <div className="bg-surface-elevated rounded-lg p-5 border border-sand shadow-sm">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Saved in Watchlist</span>
            <Bookmark className="w-4 h-4 text-coral" />
          </div>
          <div className="font-display text-3xl text-ink">
            {savedStartups.length}
          </div>
          <div className="text-xs text-muted mt-1">
            Tunisian startups under review
          </div>
        </div>

        {/* KPI 2: Deals Evaluated */}
        <div className="bg-surface-elevated rounded-lg p-5 border border-sand shadow-sm">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Deals Screened (TND)</span>
            <PieChart className="w-4 h-4 text-coral" />
          </div>
          <div className="font-display text-3xl text-ink">
            {allStartups.length}
          </div>
          <div className="text-xs text-success mt-1">
            Ranked by Smart Match Engine
          </div>
        </div>

        {/* KPI 3: Top Calculated Match */}
        <div className="bg-surface-elevated rounded-lg p-5 border border-sand shadow-sm">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Deal Match</span>
            <Sparkles className="w-4 h-4 text-success" />
          </div>
          <div className="font-display text-3xl text-bronze">
            {evaluatedStartups[0]?.smartMatch?.score ?? 0}%
          </div>
          <div className="text-xs text-muted mt-1">
            {evaluatedStartups[0]?.name || 'Aucun profil disponible'}
          </div>
        </div>

      </div>

      {/* Profile Summary Card (Crisp White Card on Dark Navy Background) */}
      <div className="bg-surface-elevated text-ink rounded-xl p-6 sm:p-8 border border-sand shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sand">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-coral text-white font-semibold text-xl flex items-center justify-center shadow-sm">
              {investor.name ? investor.name.slice(0, 2).toUpperCase() : 'TN'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-ink">
                  {investor.name}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/40">
                  {investor.type || 'Angel Investor'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sand/60 text-brown-mid">
                  {investor.firm || 'Tunisia Syndicate'}
                </span>
              </div>
              <p className="text-muted text-xs sm:text-sm mt-1 max-w-2xl">
                {investor.bio || 'Deploying smart capital in Tunisian Dinars across high-potential Tunisian founders and university spin-offs.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-surface-elevated hover:bg-surface transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore All Deals</span>
            </Link>
          </div>

        </div>

        {/* Profile Mandate Strip in TND */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div>
            <span className="text-muted font-medium block">Ticket Size in TND</span>
            <span className="font-bold text-coral text-sm mt-0.5 block">
              {investor.budgetRange || '100,000 - 500,000 TND'}
            </span>
          </div>
          <div>
            <span className="text-muted font-medium block">Investment Type</span>
            <span className="font-bold text-ink text-sm mt-0.5 block">
              {investor.investmentType || 'Equity'}
            </span>
          </div>
          <div>
            <span className="text-muted font-medium block">Preferred Governorates</span>
            <span className="font-bold text-ink text-sm mt-0.5 block">
              {investor.region || 'Tunis, Sfax, Sousse'}
            </span>
          </div>
          <div>
            <span className="text-muted font-medium block">Target Sectors</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(investor.focus || ['AgriTech', 'FinTech', 'AI / SaaS']).map((sec) => (
                <span key={sec} className="px-2 py-0.5 rounded-md bg-sand/60 text-brown-mid font-medium text-[11px]">
                  {sec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Step Investor Onboarding & Verification Workflow (Requirement 5) */}
      <InvestorVerificationFlow
        investor={investor}
      />

      {/* Bidaya Meeting Center (Requirements 4, 6, 7, 8) */}
      <MeetingCenter
        role="investor"
        currentId={investor?.id || 'inv-1'}
        onOpenAiGuide={onOpenAiGuide}
      />

      {/* Two Columns: Saved Startups (Watchlist) + Recommended Matches Sorted by Calculated Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Saved Startups (Watchlist) */}
        <div className="bg-surface-elevated rounded-xl p-6 sm:p-8 border border-sand shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-coral" />
                <span>Saved Tunisian Startups</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Companies you bookmarked for diligence review.
              </p>
            </div>
            <span className="text-xs font-bold text-coral bg-coral/10 px-2.5 py-1 rounded-full border border-coral/40">
              {savedStartups.length} Saved
            </span>
          </div>

          <div className="space-y-4">
            {savedStartups.length > 0 ? (
              savedStartups.map((s) => (
                <div key={s.id} className="p-4 rounded-lg bg-surface border border-sand space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-coral text-white font-semibold text-sm flex items-center justify-center shadow-md`}>
                        {s.name.replace(/\(.*?\)/g, '').trim().slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{s.name}</h4>
                        </div>
                        <div className="text-xs text-muted mt-0.5 flex items-center gap-2">
                          <span>{s.sector}</span>
                          <span>•</span>
                          <span className="text-coral">{s.governorate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveSaved(s.id)}
                      className="p-1.5 text-muted hover:text-danger rounded-lg transition-colors cursor-pointer"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-brown-mid line-clamp-2">
                    {s.pitch}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-sand text-xs">
                    <span className="font-bold text-coral">Seeking {s.fundingNeeded}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendInterest(s)}
                        className="px-3 py-1.5 rounded-lg font-semibold text-xs text-white bg-coral/10 hover:bg-coral-dark transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>I’m Interested</span>
                      </button>

                      <Link
                        to={`/startup/${s.id}`}
                        className="px-3 py-1.5 rounded-lg font-medium text-xs text-brown-mid bg-sand/60 hover:bg-sand hover:text-white transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-muted text-sm space-y-3">
                <p>Your watchlist is currently empty.</p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-coral/10 hover:bg-coral-dark"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Browse Startups in Tunisia</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Recommended Matches with Calculated Score & Match Tier Filter (Requirement 4) */}
        <div className="bg-surface-elevated rounded-xl p-6 sm:p-8 border border-sand shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-coral" />
                <span>Smart Match Recommendations</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
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
                      ? 'bg-coral/10 text-white shadow-sm'
                      : 'bg-surface text-muted hover:text-white'
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
                    className="p-4 rounded-lg bg-surface border border-sand space-y-3 hover:border-coral/40 transition-all cursor-pointer group"
                    onClick={() => navigate(`/startup/${s.id}`)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-coral text-white font-semibold text-sm flex items-center justify-center shadow-md`}>
                          {s.name.replace(/\(.*?\)/g, '').trim().slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white group-hover:text-coral transition-colors">
                              {s.name}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${labelBadgeClasses[match.label] || 'bg-coral/10 text-coral border-coral/40'}`}>
                              {match.score}% • {match.label}
                            </span>
                          </div>
                          <div className="text-xs text-muted mt-0.5">
                            {s.sector} • <span className="text-brown-mid font-medium">{s.stage}</span> • <span className="text-coral">{s.governorate}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-brown-mid bg-surface-elevated px-2.5 py-1 rounded-lg border border-sand">
                        {s.fundingNeeded}
                      </span>
                    </div>

                    {/* Short reason on every card (Requirement 4) */}
                    <div className="p-2.5 rounded-xl bg-surface border border-sand text-[11px] text-brown-mid flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <strong>Match Factor:</strong> {topReason}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-sand text-xs">
                      <span className="text-[11px] text-muted flex items-center gap-1">
                        <span>Vehicle:</span>
                        <strong className="text-brown-mid">{s.fundingTypeSought || 'Seed'}</strong>
                      </span>
                      
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSendInterest(s)}
                          className="px-3 py-1.5 rounded-lg font-semibold text-xs text-white bg-coral transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>I’m Interested</span>
                        </button>

                        <Link
                          to={`/startup/${s.id}`}
                          className="px-3 py-1.5 rounded-lg font-medium text-xs text-brown-mid bg-sand/60 hover:bg-sand hover:text-white transition-colors"
                        >
                          Match Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-muted text-sm">
                No recommended startups match tier "{matchFilter}".
              </div>
            )}
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/explore"
              className="text-xs font-bold text-coral hover:text-coral inline-flex items-center gap-1"
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
