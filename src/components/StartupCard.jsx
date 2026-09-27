import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Coins, 
  Sparkles, 
  Bookmark, 
  ArrowRight,
  Layers,
  CheckCircle2,
  Building
} from 'lucide-react';

export default function StartupCard({ 
  startup, 
  isSaved = false, 
  onToggleSave 
}) {
  const {
    id,
    name,
    pitch,
    sector,
    stage,
    fundingNeeded,
    governorate,
    legalStatus,
    fundingTypeSought,
    readinessScore = 0
  } = startup;

  const stageBadgeColors = {
    'Idea': 'bg-warning-bg text-warning border-warning/30',
    'MVP': 'bg-coral/10 text-coral border-coral/40',
    'Early Revenue': 'bg-success-bg text-success border-success/30',
    'Growth': 'bg-coral/10 text-coral border-coral/40'
  };

  const initials = name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group relative bg-surface-elevated text-ink rounded-lg p-6 border border-sand shadow-md hover:shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            {/* Logo Placeholder */}
            <div className={`w-13 h-13 rounded-xl bg-coral text-white font-semibold text-lg flex items-center justify-center shadow-md ring-2 ring-sand flex-shrink-0`}>
              {initials}
            </div>
            
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-lg text-ink group-hover:text-coral transition-colors">
                  {name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-taupe">
                <span className="flex items-center gap-1 font-medium text-brown-mid">
                  <MapPin className="w-3.5 h-3.5 text-coral" />
                  {governorate}, Tunisia
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-muted" />
                  {sector}
                </span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSave(id);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-coral/10 border-coral/40 text-coral'
                  : 'bg-surface border-sand/80 text-muted hover:text-brown-mid hover:bg-sand/60'
              }`}
              title={isSaved ? "Remove from watchlist" : "Save to watchlist"}
              aria-label="Save to watchlist"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-coral' : ''}`} />
            </button>
          )}
        </div>

        {/* Short Pitch */}
        <p className="text-muted text-sm leading-relaxed mb-5 line-clamp-3">
          {pitch}
        </p>

        {/* Badges & Key Metadata */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${stageBadgeColors[stage] || 'bg-sand/60 text-brown-mid border-sand'}`}>
            {stage}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-sand/60 text-brown-mid border border-sand">
            {sector}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-coral/10 text-coral border border-coral/40 flex items-center gap-1">
            <Building className="w-3 h-3 text-coral" />
            {legalStatus}
          </span>
        </div>
      </div>

      {/* Card Footer: Metrics & CTA */}
      <div className="pt-4 border-t border-sand space-y-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-surface border border-sand">
            <span className="text-muted font-medium block mb-0.5">Seeking ({fundingTypeSought})</span>
            <div className="font-bold text-ink text-sm flex items-center text-coral">
              <Coins className="w-3.5 h-3.5 mr-1 text-coral" />
              {fundingNeeded}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-coral border border-coral/40">
            <div className="flex items-center justify-between text-taupe mb-0.5 font-medium">
              <span>AI Match</span>
              <Sparkles className="w-3 h-3 text-coral" />
            </div>
            <div className="font-semibold text-transparent bg-clip-text bg-coral text-sm">
              {readinessScore}% ready
            </div>
          </div>
        </div>

        {/* View Details Link */}
        <Link
          to={`/startup/${id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-surface-elevated hover:bg-coral transition-all shadow-md group-hover:shadow-md"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
