import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Rocket, ArrowUpRight } from 'lucide-react';

export default function Footer({ onOpenAiGuide }) {
  return (
    <footer className="w-full bg-[#070B14] border-t border-slate-800/80 text-slate-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-[1px]">
                <div className="w-full h-full bg-[#0A0F1D] rounded-[11px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  SB
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">StartupBridge AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The intelligent matchmaking platform where high-conviction startups connect with smart capital. Powered by objective deal scoring and real-time founder guidance.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AI Matching Engine Active</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-800/40">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified Profiles</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explore" className="hover:text-blue-400 transition-colors">
                  Explore Startups
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-blue-400 transition-colors">
                  Choose Role / Register
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => onOpenAiGuide('startup')} 
                  className="hover:text-violet-400 transition-colors flex items-center gap-1 cursor-pointer text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>AI Guidance Engine</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Dashboards</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard/startup" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  <span>Founder Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/dashboard/investor" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  <span>Investor Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/onboarding/startup" className="hover:text-blue-400 transition-colors">
                  Submit a Pitch
                </Link>
              </li>
              <li>
                <Link to="/onboarding/investor" className="hover:text-blue-400 transition-colors">
                  Investor Mandate
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Trust & Transparency</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No private keys, no hidden broker commissions. Profiles are stored client-side for rapid interactive demonstration.
            </p>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Live Demo Mode:</span> All dashboard features, forms, and AI queries work fully offline with localStorage persistence.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} StartupBridge AI Inc. All rights reserved. Where Startups Meet Smart Capital.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-slate-400 cursor-pointer">SEC Reg CF Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
