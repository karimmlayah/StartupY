import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Zap, 
  Layers, 
  Compass, 
  Bot,
  Search,
  MessageSquare,
  Coins,
  Building2,
  BookOpen,
  MapPin
} from 'lucide-react';
import StartupCard from '../components/StartupCard';
import { INITIAL_STARTUPS } from '../data/mockStartups';

export default function LandingPage({ onOpenAiGuide }) {
  // Grab top 3 featured Tunisian startups for preview
  const featuredStartups = INITIAL_STARTUPS.slice(0, 3);

  const steps = [
    {
      number: "01",
      title: "Create Profile",
      desc: "Tunisian founders specify their governorate, legal entity (SARL, SUARL), traction, and capital requirements in TND. Investors establish ticket sizes and sector mandates.",
      icon: Users,
      badge: "Fast Onboarding",
      color: "from-blue-500 to-indigo-600"
    },
    {
      number: "02",
      title: "Find Matches",
      desc: "Our AI engine analyzes sector fit, stage readiness, ticket compatibility in TND, and regional governorates to calculate objective match scores.",
      icon: Sparkles,
      badge: "Algorithmic Fit",
      color: "from-violet-500 to-purple-600"
    },
    {
      number: "03",
      title: "Start Conversations",
      desc: "Connect directly with local business-support organizations, angel networks, local VC funds, and the Tunisian diaspora without cold-outreach friction.",
      icon: MessageSquare,
      badge: "Direct Intro",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  // Tunisian Demo Platform Stats
  const demoStats = [
    { label: "Active Startups (Demo)", value: "320+", subtext: "Across 24 governorates" },
    { label: "Capital Tracked (Demo)", value: "48M TND", subtext: "Demo platform data" },
    { label: "Investors & Angels (Demo)", value: "85+", subtext: "Funds, angels & diaspora" },
    { label: "Match Precision (Demo)", value: "93.4%", subtext: "High-conviction deal fit" }
  ];

  // Required "Tunisia Ecosystem" Section Cards
  const ecosystemCards = [
    {
      title: "Startup Funding",
      description: "Direct discovery between innovative Tunisian ventures seeking pre-seed, seed, or growth capital and investors deploying capital in Tunisian Dinars (TND).",
      icon: Coins,
      badge: "Capital Matching",
      stat: "48M TND Seek Volume",
      color: "from-blue-600 to-indigo-700"
    },
    {
      title: "Investor Discovery",
      description: "A centralized deal flow engine for business angels, institutional venture funds, corporate venture teams, and the Tunisian diaspora exploring high-potential startups.",
      icon: TrendingUp,
      badge: "Deal Flow",
      stat: "85+ Registered Angels & Funds",
      color: "from-violet-600 to-purple-700"
    },
    {
      title: "Startup Guidance",
      description: "Interactive AI assistants offering pre-investment due diligence checklists, pitch deck reviews, valuation multiple benchmarks, and legal structuring advice for Tunisia.",
      icon: Sparkles,
      badge: "AI Advisory",
      stat: "24/7 AI Engine",
      color: "from-emerald-600 to-teal-700"
    },
    {
      title: "Tunisian Ecosystem",
      description: "Collaborative linkages between university tech poles, regional business incubators, accelerators, and business-support organizations from Tunis to the interior regions.",
      icon: Building2,
      badge: "24 Governorates",
      stat: "National Reach",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-28 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-blue-300 shadow-inner mb-8">
          <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
          <span>Tunisia Entrepreneurial Ecosystem Platform</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Demo platform data</span>
        </div>

        {/* Required Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Connecting Tunisian Startups <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
            with Smart Capital.
          </span>
        </h1>

        {/* Short Description */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-10">
          StartupBridge AI connects Tunisian founders with business angels, local venture funds, incubators, and the diaspora, empowering both sides to make smarter investment decisions with objective match scoring.
        </p>

        {/* Two Required CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/explore"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/45 transition-all transform hover:-translate-y-0.5"
          >
            <Compass className="w-5 h-5" />
            <span>Explore Startups</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>

          <Link
            to="/auth"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 hover:text-white border border-slate-700/90 shadow-lg transition-all"
          >
            <span>Join as Startup</span>
          </Link>
        </div>

        {/* Micro Credibility */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Amounts in Tunisian Dinars (TND)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            Covering all 24 governorates
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            Startup Tunisia AI Guide
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <Link to="/resources" className="underline hover:text-white">Official Resources</Link>
          </span>
        </div>

        {/* Demo Scenario Highlight Card */}
        <div className="mt-10 max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-blue-950/60 border border-emerald-500/40 shadow-xl shadow-emerald-500/10 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Match Demo Walkthrough</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-white">
              “Demo: AgriSmart Tunisia is seeking 450,000 TND for Seed Investment in Sfax. Compare it with compatible investors and see why the match is recommended.”
            </p>
            <p className="text-xs text-slate-400">
              Deterministic 6-criteria scoring engine with full explainability, strengths, gaps, and recommendations.
            </p>
          </div>
          <Link
            to="/startup/agrismart-tunisia"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
          >
            <span>Inspect AgriSmart Match</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>

      {/* Platform Stats Strip (Clearly Marked as Demo Platform Data) */}
      <section className="border-y border-slate-800/80 bg-[#0C1220]/70 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              Demo platform data
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {demoStats.map((s, idx) => (
              <div key={idx} className="p-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  {s.value}
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-1">
                  {s.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {s.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Section 7: “Tunisia Ecosystem” section with 4 cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60">
            National Innovation Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">
            The Tunisia Ecosystem
          </h2>
          <p className="text-base text-slate-300">
            A comprehensive two-sided ecosystem connecting startups, angel syndicates, venture funds, and incubators across Tunisia.
          </p>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            (Demo platform data — illustrated below)
          </div>
        </div>

        {/* 4 Cards: Startup Funding, Investor Discovery, Startup Guidance, Tunisian Ecosystem */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ecosystemCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-2xl p-6 sm:p-7 border border-slate-800/90 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-semibold">{card.stat}</span>
                  <span className="text-[11px] text-slate-400">Demo</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3-Step Section: Create Profile, Find Matches, Start Conversations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/40 rounded-3xl border border-slate-800/80 my-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-950/60 px-3 py-1 rounded-full border border-violet-800/60">
            How It Works in Tunisia
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">
            Fundraising & Sourcing in Three Steps
          </h2>
          <p className="text-base text-slate-300">
            Connect founders in Sfax, Tunis, Sousse, and beyond with investors actively deploying capital in TND.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div 
                key={idx}
                className="relative bg-slate-900/90 rounded-2xl p-8 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-700/60 font-mono">
                      {st.number}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-800/40">
                    {st.badge}
                  </span>

                  <h3 className="text-xl font-bold text-white mt-3 mb-2.5">
                    {st.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center text-xs text-slate-400 font-medium">
                  <span>Explore workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Tunisian Startups (Crisp White Cards on Dark Navy Background) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-950/60 px-3 py-1 rounded-full border border-violet-800/60">
                Tunisia Deal Flow (Demo Data)
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Featured Tunisian Startups
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              Standardized profiles with governorates, legal status (SARL, SUARL), ticket sizes in TND, and AI match scores.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View all 8+ Tunisian startups</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Startups Grid (White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStartups.map((startup) => (
            <StartupCard
              key={startup.id}
              startup={startup}
            />
          ))}
        </div>
      </section>

      {/* Tunisia AI Guide Showcase Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-violet-900/40 to-slate-900 border border-violet-700/50 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-lg text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-300 bg-violet-950 px-3 py-1 rounded-full border border-violet-800">
              <Bot className="w-3.5 h-3.5 text-violet-400" />
              Startup Tunisia Guide & Investor Tunisia Guide
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need Guidance on the Tunisian Ecosystem?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ask about company creation in Tunisia (SARL/SUARL), documents for investment rounds, pitch deck expectations, or evaluating founder traction.
            </p>
            <div className="text-[11px] text-amber-300/80 italic">
              Demo guidance only — not legal, tax, investment or financial advice.
            </div>
          </div>

          <button
            onClick={() => onOpenAiGuide('startup')}
            className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/30 transition-all cursor-pointer transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-violet-200 animate-spin" />
            <span>Open Startup Tunisia Guide</span>
          </button>
        </div>
      </section>

    </div>
  );
}
