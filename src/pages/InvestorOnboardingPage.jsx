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
import { useAuth } from '../context/AuthContext';
import { saveInvestorProfile } from '../lib/supabaseData';
import { ALL_SECTORS, TUNISIAN_GOVERNORATES } from '../data/mockStartups';
import { INVESTOR_TYPES, INVESTMENT_TYPES } from '../data/mockInvestors';

export default function InvestorOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide your Investor or Firm Name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
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
    };
    try {
      await saveInvestorProfile(user?.id, payload);
      setIsSubmitting(false);
      navigate('/dashboard/investor');
    } catch (submitError) {
      setError(submitError.message || 'Unable to save the investor profile.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Breadcrumb / Top Info */}
      <div className="mb-8">
        <Link to="/auth" className="text-xs font-semibold text-coral hover:text-coral flex items-center gap-1 mb-2">
          ← Back to role selection
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-coral/10 text-coral border border-coral/40 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Create Your Investor Profile (Tunisia)
            </h1>
            <p className="text-sm text-muted">
              Set your mandate in TND and connect with deal flow matching your sector and governorate focus.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form (Crisp White Card on Dark Navy Background) */}
      <div className="bg-surface-elevated text-ink rounded-xl p-6 sm:p-10 border border-sand shadow-sm">
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger-bg border border-danger/30 text-danger text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Investor Entity & Type */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted border-b border-sand pb-2">
              1. Investor Entity & Investor Type
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="investor-name" className="block text-sm font-bold text-ink mb-1.5">
                  Investor or Firm Name <span className="text-coral">*</span>
                </label>
                <input
                  id="investor-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Slimane Ben Youssef or Carthage Angels"
                  className="w-full px-4 py-3 rounded-xl border border-sand text-ink placeholder-taupe focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-transparent text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="firm-name" className="block text-sm font-bold text-ink mb-1.5">
                  Firm / Legal Structure
                </label>
                <input
                  id="firm-name"
                  type="text"
                  name="firm"
                  value={formData.firm}
                  onChange={handleChange}
                  placeholder="Nom de votre organisation"
                  className="w-full px-4 py-3 rounded-xl border border-sand text-ink placeholder-taupe focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-transparent text-sm transition-all"
                />
              </div>

              {/* Investor Type */}
              <div>
                <label htmlFor="investor-type" className="block text-sm font-bold text-ink mb-1.5">
                  Investor Type <span className="text-coral">*</span>
                </label>
                <select
                  id="investor-type"
                  name="investorType"
                  value={formData.investorType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sand text-ink bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-transparent text-sm transition-all cursor-pointer"
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
            <div className="flex items-center justify-between border-b border-sand pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
                2. Investment Sectors in Tunisia <span className="text-coral">*</span>
              </h2>
              <span className="text-xs text-taupe">
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
                        ? 'bg-coral/10 text-white shadow-md ring-2'
                        : 'bg-sand/60 text-brown-mid hover:bg-sand'
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
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted border-b border-sand pb-2">
              3. Ticket Size in TND, Stage & Governorates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Ticket Size in TND */}
              <div>
                <label htmlFor="ticket-size" className="block text-sm font-bold text-ink mb-1.5">
                  Ticket Size in TND <span className="text-coral">*</span>
                </label>
                <select
                  id="ticket-size"
                  name="ticketSize"
                  value={formData.ticketSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sand text-ink bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-transparent text-sm transition-all cursor-pointer font-bold text-coral"
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
                <label htmlFor="preferred-stage" className="block text-sm font-bold text-ink mb-1.5">
                  Preferred Startup Stage <span className="text-coral">*</span>
                </label>
                <select
                  id="preferred-stage"
                  name="preferredStage"
                  value={formData.preferredStage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sand text-ink bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-transparent text-sm transition-all cursor-pointer"
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
                <label htmlFor="investment-type" className="block text-sm font-bold text-ink mb-1.5">
                  Investment Type <span className="text-coral">*</span>
                </label>
                <select
                  id="investment-type"
                  name="investmentType"
                  value={formData.investmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sand text-ink bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-transparent text-sm transition-all cursor-pointer"
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
              <label className="block text-sm font-bold text-ink mb-2">
                Preferred Tunisian Governorates <span className="text-coral">*</span>
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
                          ? 'bg-coral/10 text-white shadow-sm'
                          : 'bg-sand/60 text-brown-mid hover:bg-sand'
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
              <label htmlFor="portfolio-link" className="block text-sm font-bold text-ink mb-1.5">
                Portfolio or LinkedIn Link <span className="text-muted font-normal">(Optional)</span>
              </label>
              <input
                id="portfolio-link"
                type="url"
                name="portfolioLink"
                value={formData.portfolioLink}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/... or website"
                className="w-full px-4 py-3 rounded-xl border border-sand text-ink placeholder-taupe focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-transparent text-sm transition-all"
              />
            </div>

          </div>

          {/* Submission CTA */}
          <div className="pt-6 border-t border-sand flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-taupe flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-coral" />
              <span>Tunisia AI matchmaking will score deals based on TND ticket size, stage, and governorate.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-coral shadow-md transition-all cursor-pointer disabled:opacity-50"
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
