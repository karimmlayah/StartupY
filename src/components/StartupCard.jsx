import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  Bookmark, 
  ArrowRight,
  Layers,
  CheckCircle2
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
    country,
    aiMatchScore = 92,
    logoBg = "from-blue-600 to-indigo-600"
  } = startup;

  const stageBadgeColors = {
    'Idea': 'bg-amber-50 text-amber-700 border-amber-200',
    'MVP': 'bg-blue-50 text-blue-700 border-blue-200',
    'Early Revenue': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Growth': 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group relative bg-white text-slate-900 rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-950/25 hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            {/* Logo Placeholder */}
            <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${logoBg} text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20 ring-2 ring-slate-100`}>
              {initials}
            </div>
            
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                  {name}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-blue-500 inline-block flex-shrink-0" title="Verified Profile" />
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {country}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
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
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-slate-50 border-slate-200/80 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={isSaved ? "Remove from watchlist" : "Save to watchlist"}
              aria-label="Save to watchlist"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Short Pitch */}
        <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3">
          {pitch}
        </p>

        {/* Badges & Key Metadata */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${stageBadgeColors[stage] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {stage}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {sector}
          </span>
        </div>
      </div>

      {/* Card Footer: Metrics & CTA */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-medium block mb-0.5">Seeking</span>
            <div className="font-bold text-slate-900 text-sm flex items-center text-blue-600">
              <DollarSign className="w-3.5 h-3.5 mr-0.5" />
              {fundingNeeded}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100">
            <div className="flex items-center justify-between text-slate-500 mb-0.5 font-medium">
              <span>AI Match</span>
              <Sparkles className="w-3 h-3 text-violet-500" />
            </div>
            <div className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 text-sm">
              {aiMatchScore}% Score
            </div>
          </div>
        </div>

        {/* View Details Link */}
        <Link
          to={`/startup/${id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 transition-all shadow-md group-hover:shadow-blue-500/20"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
