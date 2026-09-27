import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Coins,
  MapPin,
  Compass
} from 'lucide-react';

export default function AuthChoicePage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Title & Subtitle */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-blue-400 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Tunisian Innovation Community</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How would you like to join <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
            StartupBridge AI Tunisia?
          </span>
        </h1>
        <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Select your journey to access personalized matchmaking across all 24 Tunisian governorates, tailored deal analytics, and localized AI guidance.
        </p>
      </div>

      {/* Two Large Cards (Crisp White Cards on Dark Navy Background) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        
        {/* Startup Card */}
        <div className="group relative bg-white text-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-2xl shadow-slate-950/40 hover:shadow-blue-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mb-6 group-hover:scale-105 transition-transform">
              <Building2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              For Tunisian Founders & Teams
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-3">
              I’m a Startup
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Raise smart capital in Tunisian Dinars (TND) from business angels, local venture funds, incubators, and the diaspora. Showcase your verified traction and get AI feedback on your pitch deck.
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Benefits for Tunisian Founders:
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Publish your pitch and traction to active investors in TND</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Receive inbound interest requests with verified ticket sizes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Access the Startup Tunisia AI Guide for legal & pitch advisory</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Visibility across all 24 Tunisian governorates</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-100">
            <Link
              to="/onboarding/startup"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all text-sm group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600"
            >
              <span>Continue as Startup</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard/startup"
              className="w-full text-center block text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors py-1"
            >
              Or preview Demo Founder Dashboard →
            </Link>
          </div>
        </div>

        {/* Investor Card */}
        <div className="group relative bg-white text-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-2xl shadow-slate-950/40 hover:shadow-violet-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-violet-600/30 mb-6 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
              For Angels, VCs, Incubators & Diaspora
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-3">
              I’m an Investor
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Source verified deal flow from Tunis, Sfax, Sousse, Bizerte, and interior regions. Filter by ticket size in TND, legal status, and AI thesis compatibility.
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Benefits for Investors:
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />
                  <span>Curated Tunisian deal flow filtered by governorates & sectors</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />
                  <span>Objective AI Match Scoring calibrated for local stage metrics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />
                  <span>One-click "I'm Interested" outreach directly to founders</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />
                  <span>Private watchlist and deal pipeline management in TND</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-100">
            <Link
              to="/onboarding/investor"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 transition-all text-sm"
            >
              <span>Continue as Investor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard/investor"
              className="w-full text-center block text-xs font-medium text-slate-500 hover:text-violet-600 transition-colors py-1"
            >
              Or preview Demo Investor Dashboard →
            </Link>
          </div>
        </div>

      </div>

      {/* Alternative Explore Link */}
      <div className="text-center mt-12 text-sm text-slate-400">
        Looking for official Tunisian business creation resources?{' '}
        <Link to="/resources" className="text-blue-400 font-semibold hover:underline inline-flex items-center gap-1">
          Explore Official Resources
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
