import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Globe, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { saveCurrentInvestor } from '../utils/storage';
import { ALL_SECTORS } from '../data/mockStartups';

export default function InvestorOnboardingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    sectors: ['AI & Machine Learning', 'B2B SaaS', 'FinTech'],
    budgetRange: '$250,000 - $1,000,000',
    preferredStage: 'Early Revenue',
    region: 'North America & Europe',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const stageOptions = ['Idea', 'MVP', 'Early Revenue', 'Growth'];

  const budgetOptions = [
    '$50,000 - $250,000 (Angel / Scout)',
    '$250,000 - $1,000,000 (Seed Check)',
    '$1,000,000 - $3,000,000 (Lead Seed)',
    '$3,000,000 - $10,000,000 (Series A / Multi-stage)'
  ];

  const regionOptions = [
    'North America',
    'Europe & UK',
    'North America & Europe',
    'Asia-Pacific',
    'Latin America',
    'Middle East & Africa',
    'Global / Remote First'
  ];

  const selectableSectors = ALL_SECTORS.filter(s => s !== 'All');

  const toggleSector = (sector) => {
    setFormData(prev => {
      const exists = prev.sectors.includes(sector);
      if (exists) {
        if (prev.sectors.length === 1) return prev; // Keep at least one
        return { ...prev, sectors: prev.sectors.filter(s => s !== sector) };
      } else {
        return { ...prev, sectors: [...prev.sectors, sector] };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide your Investor or Syndicate Name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    saveCurrentInvestor({
      name: formData.name.trim(),
      firm: formData.firm.trim() || `${formData.name.trim()} Capital`,
      focus: formData.sectors,
      budgetRange: formData.budgetRange,
      preferredStage: formData.preferredStage,
      region: formData.region,
      bio: formData.bio || 'Active investor backing visionary founders shaping the future of technology.',
      totalInvested: '$12.5M',
      activeInvestments: 8
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard/investor');
    }, 600);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Breadcrumb / Top Info */}
      <div className="mb-8">
        <Link to="/auth" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 mb-2">
          ← Back to role selection
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Your Investor Profile
            </h1>
            <p className="text-sm text-slate-400">
              Set your mandate and get matched with deal flow aligned to your thesis.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form (Crisp White Card on Dark Navy Background) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-2xl shadow-slate-950/40">
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Investor Identity */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              1. Investor & Entity Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="investor-name" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Investor Name <span className="text-violet-600">*</span>
                </label>
                <input
                  id="investor-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Victoria Stirling or Sterling Ventures"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="firm-name" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Firm / Syndicate / Angel Affiliation
                </label>
                <input
                  id="firm-name"
                  type="text"
                  name="firm"
                  value={formData.firm}
                  onChange={handleChange}
                  placeholder="e.g. Apex Horizon Capital (or Solo Angel)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Investment Focus / Sectors */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                2. Investment Focus / Sectors <span className="text-violet-600">*</span>
              </h2>
              <span className="text-xs text-slate-500">
                Select all that apply
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {selectableSectors.map((sector) => {
                const isSelected = formData.sectors.includes(sector);
                return (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => toggleSector(sector)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25 ring-2 ring-violet-600/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{sector}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Criteria & Range */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              3. Check Size, Preferred Stage & Geography
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Budget Range */}
              <div>
                <label htmlFor="budget-range" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Budget / Check Size Range <span className="text-violet-600">*</span>
                </label>
                <select
                  id="budget-range"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all cursor-pointer"
                >
                  {budgetOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Stage */}
              <div>
                <label htmlFor="preferred-stage" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Preferred Startup Stage <span className="text-violet-600">*</span>
                </label>
                <select
                  id="preferred-stage"
                  name="preferredStage"
                  value={formData.preferredStage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all cursor-pointer"
                >
                  {stageOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div className="sm:col-span-2">
                <label htmlFor="region-select" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Country / Geographic Focus <span className="text-violet-600">*</span>
                </label>
                <select
                  id="region-select"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all cursor-pointer"
                >
                  {regionOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Submission CTA */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>AI deal-matching algorithm will rank matching startups immediately.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Creating Profile...' : 'Create Investor Profile'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
