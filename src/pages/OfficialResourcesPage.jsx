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
      color: "",
      status: "Knowledge Base Integration Pending"
    },
    {
      title: "Investment and Funding Guidance",
      description: "Standard investor instruments, equity dilution norms, convertible notes, debt facilities, and governance standards in Tunisia.",
      icon: Coins,
      badge: "Financing Frameworks",
      color: "",
      status: "Knowledge Base Integration Pending"
    },
    {
      title: "Startup Support Programs",
      description: "Directory of recognized incubation, acceleration, co-working, and technical mentorship initiatives across all Tunisian governorates.",
      icon: Rocket,
      badge: "Ecosystem Programs",
      color: "",
      status: "Knowledge Base Integration Pending"
    },
    {
      title: "Tax and Compliance Resources",
      description: "Fiscal regulations, corporate reporting calendars, social security registration, and accounting frameworks under Tunisian laws.",
      icon: FileText,
      badge: "Fiscal & Accounting",
      color: "",
      status: "Knowledge Base Integration Pending"
    },
    {
      title: "Intellectual Property and Trademark Resources",
      description: "Industrial property registration, patent protection protocols, brand trademarking, and software copyright guidelines in Tunisia.",
      icon: ShieldCheck,
      badge: "IP & Trademarks",
      color: "",
      status: "Knowledge Base Integration Pending"
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-sand text-xs font-semibold text-coral">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official Tunisian Ecosystem Repository</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">
          Official Tunisian Resources
        </h1>
        
        <p className="text-base text-brown-mid leading-relaxed max-w-2xl mx-auto">
          Centralized documentation catalog designed to connect Tunisian entrepreneurs, corporate entities, and investors with verified institutional guidance.
        </p>

        {/* Mandatory Explicit Requirement Message */}
        <div className="mt-6 p-4 sm:p-5 rounded-lg bg-coral border border-coral/40 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center flex-shrink-0 border border-coral/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Verified official Tunisian resources will be added to the AI knowledge base.
              </div>
              <div className="text-xs text-muted mt-0.5">
                Our team is curating validated guides from official regulatory bodies and ecosystem partners.
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenAiGuide('startup')}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-coral/10 hover:bg-coral-dark transition-colors shadow-md cursor-pointer"
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
              className="bg-surface-elevated text-ink rounded-xl p-6 sm:p-8 border border-sand shadow-md flex flex-col justify-between hover:shadow-sm hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-coral text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-taupe bg-sand/60 px-2.5 py-1 rounded-full border border-sand">
                    {res.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-ink mb-2.5">
                  {res.title}
                </h2>

                <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-sand space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-coral">
                  <Clock className="w-3.5 h-3.5 text-coral" />
                  <span>{res.status}</span>
                </div>

                <button
                  onClick={() => onOpenAiGuide('startup')}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs text-ink bg-sand/60 hover:bg-sand transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-coral" />
                  <span>Explore Guidance with AI</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Informational Guidance Tile */}
        <div className="bg-surface-elevated text-white rounded-xl p-6 sm:p-8 border border-sand shadow-md flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-lg bg-coral/10 text-coral border border-coral/40 flex items-center justify-center font-bold mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Need Direct Advisory?
            </h3>

            <p className="text-xs text-brown-mid leading-relaxed mb-6">
              Use the Startup Tunisia Guide or Investor Tunisia Guide to ask questions about documentation, pitch decks, and investor evaluation standards.
            </p>
          </div>

          <button
            onClick={() => onOpenAiGuide('startup')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-coral transition-all shadow-md cursor-pointer"
          >
            <span>Open Startup Tunisia Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted max-w-2xl mx-auto pt-6 border-t border-sand">
        Demo guidance only — not legal, tax, investment or financial advice. Official Tunisian sources should be consulted.
      </div>

    </div>
  );
}
