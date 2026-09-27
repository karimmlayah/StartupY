import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Coins, 
  Globe, 
  Layers, 
  ShieldCheck,
  Building2,
  MapPin
} from 'lucide-react';
import { saveCurrentInvestor } from '../utils/storage';
import { ALL_SECTORS, TUNISIAN_GOVERNORATES } from '../data/mockStartups';
import { INVESTOR_TYPES, INVESTMENT_TYPES } from '../data/mockInvestors';

export default function InvestorOnboardingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    investorType: 'Angel Investor',
    sectors: ['AgriTech', 'FinTech', 'AI / SaaS'],
    ticketSize: '100,000 - 500,000 TND',
    preferredStage: 'Early Revenue',
    preferredGovernorates: ['Tunis', 'Sfax', 'Sousse'],
    investmentType: 'Equity',
    portfolioLink: '',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const stageOptions = ['Idea', 'MVP', 'Early Revenue', 'Growth'];

  const ticketOptions = [
    '20,000 - 50,000 TND (Micro Grant / Prototype)',
    '50,000 - 250,000 TND (Angel Ticket)',
    '250,000 - 750,000 TND (Seed Round)',
    '750,000 - 2,000,000+ TND (Venture / Series A)'
  ];

  const selectableSectors = ALL_SECTORS.filter(s => s !== 'All');
  const majorGovernorates = ['All Governorates', 'Tunis', 'Ariana', 'Ben Arous', 'Sfax', 'Sousse', 'Monastir', 'Nabeul', 'Bizerte', 'Médenine', 'Kairouan'];

  const toggleSector = (sector) => {
    setFormData(prev => {
      const exists = prev.sectors.includes(sector);
      if (exists) {
        if (prev.sectors.length === 1) return prev;
        return { ...prev, sectors: prev.sectors.filter(s => s !== sector) };
      } else {
        return { ...prev, sectors: [...prev.sectors, sector] };
      }
    });
  };

  const toggleGovernorate = (gov) => {
    setFormData(prev => {
      if (gov === 'All Governorates') {
        return { ...prev, preferredGovernorates: ['All Governorates'] };
      }
      const cleaned = prev.preferredGovernorates.filter(g => g !== 'All Governorates');
      const exists = cleaned.includes(gov);
      if (exists) {
        if (cleaned.length === 1) return prev;
        return { ...prev, preferredGovernorates: cleaned.filter(g => g !== gov) };
      } else {
        return { ...prev, preferredGovernorates: [...cleaned, gov] };
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
      setError('Please provide your Investor or Firm Name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    saveCurrentInvestor({
      name: formData.name.trim(),
      firm: formData.firm.trim() || `${formData.name.trim()} Capital`,
      type: formData.investorType,
      focus: formData.sectors,
      budgetRange: formData.ticketSize,
      preferredStage: formData.preferredStage,
      region: formData.preferredGovernorates.join(', '),
      investmentType: formData.investmentType,
      linkedIn: formData.portfolioLink.trim(),
      bio: formData.bio || 'Active investor deploying smart capital in Tunisian Dinars (TND) across Tunisian startups.',
      totalInvested: '1,800,000 TND (Demo)',
      activeInvestments: 6
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
              Create Your Investor Profile (Tunisia)
            </h1>
            <p className="text-sm text-slate-400">
              Set your mandate in TND and connect with deal flow matching your sector and governorate focus.
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
          
          {/* Section 1: Investor Entity & Type */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              1. Investor Entity & Investor Type
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="investor-name" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Investor or Firm Name <span className="text-violet-600">*</span>
                </label>
                <input
                  id="investor-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Slimane Ben Youssef or Carthage Angels"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="firm-name" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Firm / Legal Structure
                </label>
                <input
                  id="firm-name"
                  type="text"
                  name="firm"
                  value={formData.firm}
                  onChange={handleChange}
                  placeholder="e.g. Carthage Ventures (Demo)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all"
                />
              </div>

              {/* Investor Type */}
              <div>
                <label htmlFor="investor-type" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Investor Type <span className="text-violet-600">*</span>
                </label>
                <select
                  id="investor-type"
                  name="investorType"
                  value={formData.investorType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all cursor-pointer"
                >
                  {INVESTOR_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Investment Focus / Sectors */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                2. Investment Sectors in Tunisia <span className="text-violet-600">*</span>
              </h2>
              <span className="text-xs text-slate-500">
                Select your target categories
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

          {/* Section 3: Ticket Size in TND, Investment Type & Preferred Governorates */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              3. Ticket Size in TND, Stage & Governorates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Ticket Size in TND */}
              <div>
                <label htmlFor="ticket-size" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Ticket Size in TND <span className="text-violet-600">*</span>
                </label>
                <select
                  id="ticket-size"
                  name="ticketSize"
                  value={formData.ticketSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all cursor-pointer font-bold text-violet-700"
                >
                  {ticketOptions.map((b) => (
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

              {/* Investment Type */}
              <div>
                <label htmlFor="investment-type" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Investment Type <span className="text-violet-600">*</span>
                </label>
                <select
                  id="investment-type"
                  name="investmentType"
                  value={formData.investmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all cursor-pointer"
                >
                  {INVESTMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Preferred Tunisian Governorates (Multi-select) */}
            <div className="pt-2">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Preferred Tunisian Governorates <span className="text-violet-600">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {majorGovernorates.map((gov) => {
                  const isSelected = formData.preferredGovernorates.includes(gov);
                  return (
                    <button
                      key={gov}
                      type="button"
                      onClick={() => toggleGovernorate(gov)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {gov}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Portfolio or LinkedIn Link (Optional) */}
            <div className="pt-2">
              <label htmlFor="portfolio-link" className="block text-sm font-bold text-slate-800 mb-1.5">
                Portfolio or LinkedIn Link <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="portfolio-link"
                type="url"
                name="portfolioLink"
                value={formData.portfolioLink}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/... or website"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm transition-all"
              />
            </div>

          </div>

          {/* Submission CTA */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Tunisia AI matchmaking will score deals based on TND ticket size, stage, and governorate.</span>
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
