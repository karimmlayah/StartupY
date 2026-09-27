import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Coins, 
  Rocket, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  Clock,
  BookOpen
} from 'lucide-react';

export default function OfficialResourcesPage({ onOpenAiGuide }) {
  const resourceCategories = [
    {
      title: "Business Creation and Legal Guidance",
      description: "Official legal forms, incorporation procedures, registry guidelines, and statutory structuring frameworks for Tunisian enterprises.",
      icon: Building2,
      badge: "Legal Structuring",
      color: "from-blue-600 to-indigo-700",
      status: "Knowledge Base Integration Pending"
    },
    {
      title: "Investment and Funding Guidance",
      description: "Standard investor instruments, equity dilution norms, convertible notes, debt facilities, and governance standards in Tunisia.",
      icon: Coins,
      badge: "Financing Frameworks",
      color: "from-violet-600 to-purple-700",
      status: "Knowledge Base Integration Pending"
    },
    {
      title: "Startup Support Programs",
      description: "Directory of recognized incubation, acceleration, co-working, and technical mentorship initiatives across all Tunisian governorates.",
      icon: Rocket,
      badge: "Ecosystem Programs",
      color: "from-emerald-600 to-teal-700",
      status: "Knowledge Base Integration Pending"
    },
    {
      title: "Tax and Compliance Resources",
      description: "Fiscal regulations, corporate reporting calendars, social security registration, and accounting frameworks under Tunisian laws.",
      icon: FileText,
      badge: "Fiscal & Accounting",
      color: "from-amber-500 to-orange-600",
      status: "Knowledge Base Integration Pending"
    },
    {
      title: "Intellectual Property and Trademark Resources",
      description: "Industrial property registration, patent protection protocols, brand trademarking, and software copyright guidelines in Tunisia.",
      icon: ShieldCheck,
      badge: "IP & Trademarks",
      color: "from-cyan-600 to-blue-700",
      status: "Knowledge Base Integration Pending"
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-blue-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official Tunisian Ecosystem Repository</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Official Tunisian Resources
        </h1>
        
        <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Centralized documentation catalog designed to connect Tunisian entrepreneurs, corporate entities, and investors with verified institutional guidance.
        </p>

        {/* Mandatory Explicit Requirement Message */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-violet-950/70 border border-blue-700/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Verified official Tunisian resources will be added to the AI knowledge base.
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Our team is curating validated guides from official regulatory bodies and ecosystem partners.
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenAiGuide('startup')}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
          >
            <span>Consult AI Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 Required Resource Cards (Crisp White Cards on Dark Navy Background) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourceCategories.map((res, idx) => {
          const Icon = res.icon;
          return (
            <div
              key={idx}
              className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-950/20 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${res.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {res.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-2.5">
                  {res.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{res.status}</span>
                </div>

                <button
                  onClick={() => onOpenAiGuide('startup')}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>Explore Guidance with AI</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Informational Guidance Tile */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-violet-600/30 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Need Direct Advisory?
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Use the Startup Tunisia Guide or Investor Tunisia Guide to ask questions about documentation, pitch decks, and investor evaluation standards.
            </p>
          </div>

          <button
            onClick={() => onOpenAiGuide('startup')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all shadow-md cursor-pointer"
          >
            <span>Open Startup Tunisia Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-slate-400 max-w-2xl mx-auto pt-6 border-t border-slate-800">
        Demo guidance only — not legal, tax, investment or financial advice. Official Tunisian sources should be consulted.
      </div>

    </div>
  );
}
