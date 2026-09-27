import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  RotateCcw, 
  Compass, 
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  Building2
} from 'lucide-react';
import StartupCard from '../components/StartupCard';
import { getAllStartups, getSavedStartupIds, toggleSaveStartup } from '../utils/storage';
import { ALL_SECTORS, ALL_STAGES, ALL_COUNTRIES } from '../data/mockStartups';

export default function ExplorePage() {
  const [startups, setStartups] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'funding' | 'name'

  useEffect(() => {
    // Load startups (includes mock + any newly published via onboarding)
    setStartups(getAllStartups());
    setSavedIds(getSavedStartupIds());
  }, []);

  const handleToggleSave = (id) => {
    const updated = toggleSaveStartup(id);
    setSavedIds(updated);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All');
    setSelectedStage('All');
    setSelectedCountry('All');
    setSortBy('match');
  };

  // Filter and sort startups
  const filteredStartups = useMemo(() => {
    return startups
      .filter((s) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = s.name?.toLowerCase().includes(q);
          const matchPitch = s.pitch?.toLowerCase().includes(q);
          const matchSector = s.sector?.toLowerCase().includes(q);
          const matchCountry = s.country?.toLowerCase().includes(q);
          if (!matchName && !matchPitch && !matchSector && !matchCountry) {
            return false;
          }
        }

        // Sector filter
        if (selectedSector !== 'All' && s.sector !== selectedSector) {
          return false;
        }

        // Stage filter
        if (selectedStage !== 'All' && s.stage !== selectedStage) {
          return false;
        }

        // Country filter
        if (selectedCountry !== 'All' && s.country !== selectedCountry) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return (b.aiMatchScore || 85) - (a.aiMatchScore || 85);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'funding') {
          // Parse funding numbers roughly
          const getNum = (str) => {
            if (!str) return 0;
            return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
          };
          return getNum(b.fundingNeeded) - getNum(a.fundingNeeded);
        }
        return 0;
      });
  }, [startups, searchQuery, selectedSector, selectedStage, selectedCountry, sortBy]);

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedSector !== 'All' || 
    selectedStage !== 'All' || 
    selectedCountry !== 'All' ||
    sortBy !== 'match';

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-blue-400 mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Vetted Deal Flow Engine</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Startups
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-400 max-w-2xl">
              Discover seed and early-stage companies vetted with algorithmic AI Match Scoring, real metrics, and verified founders.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
              Showing {filteredStartups.length} of {startups.length} Startups
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 mb-8 shadow-xl space-y-4">
        
        {/* Search Bar + Sort */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by startup name, sector, technology, or country..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-8 py-3 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="match">Sort: Highest AI Match</option>
                <option value="funding">Sort: Funding Seeking</option>
                <option value="name">Sort: Company Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          
          {/* Sector Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Sector
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {ALL_SECTORS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'All' ? 'All Sectors' : sec}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Stage
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {ALL_STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {stg === 'All' ? 'All Stages' : stg}
                </option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Country / Region
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {ALL_COUNTRIES.map((cty) => (
                <option key={cty} value={cty}>
                  {cty === 'All' ? 'All Countries' : cty}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                hasActiveFilters
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
                  : 'bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed opacity-50'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

        </div>

      </div>

      {/* Startups Grid (Crisp White Cards on Dark Navy Background) */}
      {filteredStartups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <StartupCard
              key={startup.id}
              startup={startup}
              isSaved={savedIds.includes(startup.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-800 max-w-lg mx-auto my-12">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No matching startups found</h3>
          <p className="text-sm text-slate-400 mb-6">
            We couldn't find any startups matching your current search criteria. Try loosening your sector, stage, or country filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
}
