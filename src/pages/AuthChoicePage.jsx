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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-sand text-xs font-semibold text-coral mb-4">
          <Sparkles className="w-3.5 h-3.5 text-coral" />
          <span>Tunisian Innovation Community</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">
          How would you like to join <br />
          <span className="text-coral">StartupY?</span>
        </h1>
        <p className="mt-4 text-base text-muted max-w-xl mx-auto leading-relaxed">
          Select your journey to access personalized matchmaking across all 24 Tunisian governorates, tailored deal analytics, and localized AI guidance.
        </p>
      </div>

      {/* Two Large Cards (Crisp White Cards on Dark Navy Background) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        
        {/* Startup Card */}
        <div className="group relative bg-surface-elevated text-ink rounded-xl p-8 sm:p-10 border border-sand shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-lg bg-coral text-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-105 transition-transform">
              <Building2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-coral bg-coral/10 px-3 py-1 rounded-full border border-coral/40">
              For Tunisian Founders & Teams
            </span>

            <h2 className="text-2xl sm:text-3xl font-semibold text-ink mt-3 mb-3">
              I’m a Startup
            </h2>

            <p className="text-muted text-sm leading-relaxed mb-6">
              Raise smart capital in Tunisian Dinars (TND) from business angels, local venture funds, incubators, and the diaspora. Showcase your verified traction and get AI feedback on your pitch deck.
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                Key Benefits for Tunisian Founders:
              </h4>
              <ul className="space-y-2.5 text-sm text-brown-mid">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0" />
                  <span>Publish your pitch and traction to active investors in TND</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0" />
                  <span>Receive inbound interest requests with verified ticket sizes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0" />
                  <span>Access the Startup Tunisia AI Guide for legal & pitch advisory</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0" />
                  <span>Visibility across all 24 Tunisian governorates</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-sand">
            <Link
              to="/onboarding/startup"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-coral px-6 py-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-coral-dark"
            >
              <span>Continue as Startup</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard/startup"
              className="w-full text-center block text-xs font-medium text-taupe hover:text-coral transition-colors py-1"
            >
              Continuer comme fondateur →
            </Link>
          </div>
        </div>

        {/* Investor Card */}
        <div className="group relative bg-surface-elevated text-ink rounded-xl p-8 sm:p-10 border border-sand shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-lg bg-coral text-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-coral bg-coral/10 px-3 py-1 rounded-full border border-coral/40">
              For Angels, VCs, Incubators & Diaspora
            </span>

            <h2 className="text-2xl sm:text-3xl font-semibold text-ink mt-3 mb-3">
              I’m an Investor
            </h2>

            <p className="text-muted text-sm leading-relaxed mb-6">
              Source verified deal flow from Tunis, Sfax, Sousse, Bizerte, and interior regions. Filter by ticket size in TND, legal status, and AI thesis compatibility.
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                Key Benefits for Investors:
              </h4>
              <ul className="space-y-2.5 text-sm text-brown-mid">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0" />
                  <span>Curated Tunisian deal flow filtered by governorates & sectors</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0" />
                  <span>Objective AI Match Scoring calibrated for local stage metrics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0" />
                  <span>One-click "I'm Interested" outreach directly to founders</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0" />
                  <span>Private watchlist and deal pipeline management in TND</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-sand">
            <Link
              to="/onboarding/investor"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-coral shadow-sm transition-all text-sm"
            >
              <span>Continue as Investor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard/investor"
              className="w-full text-center block text-xs font-medium text-taupe hover:text-coral transition-colors py-1"
            >
              Continuer comme investisseur →
            </Link>
          </div>
        </div>

      </div>

      {/* Alternative Explore Link */}
      <div className="text-center mt-12 text-sm text-muted">
        Looking for official Tunisian business creation resources?{' '}
        <Link to="/resources" className="text-coral font-semibold hover:underline inline-flex items-center gap-1">
          Explore Official Resources
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
