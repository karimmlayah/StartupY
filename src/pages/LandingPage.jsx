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
  Globe, 
  Compass, 
  Bot,
  Search,
  MessageSquare
} from 'lucide-react';
import StartupCard from '../components/StartupCard';
import { INITIAL_STARTUPS } from '../data/mockStartups';

export default function LandingPage({ onOpenAiGuide }) {
  // Grab top 3 featured startups for preview
  const featuredStartups = INITIAL_STARTUPS.slice(0, 3);

  const steps = [
    {
      number: "01",
      title: "Create Profile",
      desc: "Founders publish their metrics, traction, and capital requirements. Investors define sector thesis, check sizes, and stage preferences.",
      icon: Users,
      badge: "Fast Setup",
      color: "from-blue-500 to-indigo-600"
    },
    {
      number: "02",
      title: "Find Matches",
      desc: "Our AI engine analyzes quantitative traction, valuation benchmarks, and strategic alignment to calculate verified match scores.",
      icon: Sparkles,
      badge: "AI Scoring",
      color: "from-violet-500 to-purple-600"
    },
    {
      number: "03",
      title: "Start Conversations",
      desc: "Bypass cold inboxes. Connect directly through curated intro requests, schedule diligence sessions, and close rounds faster.",
      icon: MessageSquare,
      badge: "Direct Access",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const stats = [
    { label: "Capital Deployed", value: "$148M+", subtext: "Across seed to Series A" },
    { label: "Vetted Startups", value: "1,250+", subtext: "Global tech innovators" },
    { label: "Active Investors", value: "420+", subtext: "VC funds & angels" },
    { label: "AI Match Precision", value: "94.2%", subtext: "First-meeting conversion" }
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
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
          <span className="flex h-2 w-2 rounded-full bg-blue-400 -ml-4"></span>
          <span>Next-Gen Fundraising & Deal Flow Ecosystem</span>
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Where Startups Meet <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
            Smart Capital.
          </span>
        </h1>

        {/* Short Description */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-10">
          StartupBridge AI connects founders with relevant investors and helps both make smarter decisions through objective match scoring and real-time AI guidance.
        </p>

        {/* Two CTA Buttons */}
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
            Zero broker fees
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            No account required to explore
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            AI pitch & valuation advisory
          </span>
        </div>

      </section>

      {/* Platform Stats Strip */}
      <section className="border-y border-slate-800/80 bg-[#0C1220]/70 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => (
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
      </section>

      {/* 3-Step Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60">
            How StartupBridge Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">
            Fundraising & Sourcing, Streamlined in Three Steps
          </h2>
          <p className="text-base text-slate-300">
            Eliminate weeks of unfocused cold calls. Connect on thesis alignment and verified performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div 
                key={idx}
                className="relative bg-slate-900/90 rounded-2xl p-8 border border-slate-800/90 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
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

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center text-xs text-slate-400 font-medium group-hover:text-blue-400 transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Startups Section (Notice the high-contrast White Cards as requested) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-950/60 px-3 py-1 rounded-full border border-violet-800/60">
              Live Deal Flow Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Featured High-Conviction Startups
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              Clean modern profiles with verified metrics, AI Match scores, and stage-specific milestones.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View all 8+ startups</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Startups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStartups.map((startup) => (
            <StartupCard
              key={startup.id}
              startup={startup}
            />
          ))}
        </div>
      </section>

      {/* Two-Sided Platform Value Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#0F172A] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built for Both Sides of the Investment Equation
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Accelerating fundraising velocity for founders while delivering high-signal deal flow to investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* For Startups */}
            <div className="bg-slate-800/60 rounded-2xl p-6 sm:p-8 border border-slate-700/60 hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4 border border-blue-500/30">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">For Founders & Startups</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Stop wasting time pitching funds that don't invest in your sector or stage. Get matched with investors actively deploying into your category.
              </p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  Instant publishing with verified metric display
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  Real-time notification when investors view or save profile
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  AI guide for pitch deck improvements & due diligence checklists
                </li>
              </ul>
              <Link
                to="/onboarding/startup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/30"
              >
                <span>Publish Startup Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For Investors */}
            <div className="bg-slate-800/60 rounded-2xl p-6 sm:p-8 border border-slate-700/60 hover:border-violet-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold mb-4 border border-violet-500/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">For Angels & VCs</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Filter deal flow by check size, MRR trajectory, country, and AI alignment. Save high-potential companies to your private watchlist.
              </p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  Pre-screened quantitative metrics and founder backgrounds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  AI Match Scoring against your customized investment thesis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  Direct "I'm Interested" outreach button with zero friction
                </li>
              </ul>
              <Link
                to="/onboarding/investor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors shadow-md shadow-violet-600/30"
              >
                <span>Create Investor Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* AI Guide Showcase Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-violet-900/40 to-slate-900 border border-violet-700/50 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-lg text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-300 bg-violet-950 px-3 py-1 rounded-full border border-violet-800">
              <Bot className="w-3.5 h-3.5 text-violet-400" />
              Interactive AI Assistant
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need Fundraising or Diligence Advice?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Consult the StartupBridge AI Guide for instant insights on valuation multiples, pitch deck structure, cap table dilution, and investor red flags.
            </p>
          </div>

          <button
            onClick={() => onOpenAiGuide('startup')}
            className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/30 transition-all cursor-pointer transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-violet-200 animate-spin" />
            <span>Open AI Guide</span>
          </button>
        </div>
      </section>

    </div>
  );
}
