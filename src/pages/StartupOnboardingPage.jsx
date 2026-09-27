import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  MapPin, 
  Layers, 
  Rocket 
} from 'lucide-react';
import { saveNewStartup } from '../utils/storage';
import { ALL_SECTORS } from '../data/mockStartups';

export default function StartupOnboardingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    pitch: '',
    sector: 'AI & Machine Learning',
    stage: 'Early Revenue',
    fundingNeeded: '$1,500,000',
    country: 'United States',
    teamSize: '5'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const stageOptions = [
    { id: 'Idea', label: 'Idea', desc: 'Concept & research phase' },
    { id: 'MVP', label: 'MVP', desc: 'Working prototype built' },
    { id: 'Early Revenue', label: 'Early Revenue', desc: 'Paying beta or recurring users' },
    { id: 'Growth', label: 'Growth', desc: 'Scaling unit economics' }
  ];

  const fundingOptions = [
    '$250,000',
    '$500,000',
    '$1,000,000',
    '$1,500,000',
    '$2,500,000',
    '$5,000,000+'
  ];

  const countryOptions = [
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Canada',
    'Singapore',
    'United Arab Emirates',
    'Australia',
    'India',
    'Netherlands',
    'Other'
  ];

  const selectableSectors = ALL_SECTORS.filter(s => s !== 'All');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStageSelect = (stageId) => {
    setFormData(prev => ({
      ...prev,
      stage: stageId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide your Startup Name');
      return;
    }
    if (!formData.pitch.trim()) {
      setError('Please provide a one-line pitch');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Save to localStorage
    const saved = saveNewStartup({
      name: formData.name.trim(),
      pitch: formData.pitch.trim(),
      sector: formData.sector,
      stage: formData.stage,
      fundingNeeded: formData.fundingNeeded,
      country: formData.country,
      teamSize: formData.teamSize
    });

    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to the Startup Dashboard
      navigate('/dashboard/startup');
    }, 600);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Breadcrumb / Top Info */}
      <div className="mb-8">
        <Link to="/auth" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-2">
          ← Back to role selection
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Publish Your Startup Profile
            </h1>
            <p className="text-sm text-slate-400">
              Get matched with strategic investors and unlock AI pitch guidance.
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
          
          {/* Section 1: Core Identity */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              1. Startup Identity
            </h2>

            {/* Startup Name */}
            <div>
              <label htmlFor="startup-name" className="block text-sm font-bold text-slate-800 mb-1.5">
                Startup Name <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="startup-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. OmniPulse AI, Nexus Energy, MediFlow"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* One-Line Pitch */}
            <div>
              <label htmlFor="one-line-pitch" className="block text-sm font-bold text-slate-800 mb-1.5">
                One-Line Pitch <span className="text-blue-600">*</span>
              </label>
              <textarea
                id="one-line-pitch"
                name="pitch"
                rows={3}
                value={formData.pitch}
                onChange={handleChange}
                placeholder="What does your startup do, who is it for, and what unfair advantage do you have? (e.g. Autonomous AI agent workforce for multi-channel customer operations)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all resize-none"
                required
              />
              <span className="text-xs text-slate-400 mt-1 block">
                Keep it concise and outcome-driven for investor deal flow cards.
              </span>
            </div>
          </div>

          {/* Section 2: Sector & Stage */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              2. Industry & Development Stage
            </h2>

            {/* Sector */}
            <div>
              <label htmlFor="sector-select" className="block text-sm font-bold text-slate-800 mb-1.5">
                Primary Sector <span className="text-blue-600">*</span>
              </label>
              <select
                id="sector-select"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all cursor-pointer"
              >
                {selectableSectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Current Stage <span className="text-blue-600">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stageOptions.map((st) => {
                  const isSelected = formData.stage === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleStageSelect(st.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/30'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                        <span>{st.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-tight">
                        {st.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Financing & Team */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              3. Capital Requirements & Operations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Funding Needed */}
              <div>
                <label htmlFor="funding-needed" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Funding Needed <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <select
                    id="funding-needed"
                    name="fundingNeeded"
                    value={formData.fundingNeeded}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all cursor-pointer"
                  >
                    {fundingOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country-select" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Country <span className="text-blue-600">*</span>
                </label>
                <select
                  id="country-select"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all cursor-pointer"
                >
                  {countryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team Size */}
              <div>
                <label htmlFor="team-size" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Team Size <span className="text-blue-600">*</span>
                </label>
                <input
                  id="team-size"
                  type="text"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  placeholder="e.g. 5 or 8 members"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                  required
                />
              </div>

            </div>
          </div>

          {/* Submission CTA */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Instant AI Match Scoring will be calculated upon publication.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Publishing...' : 'Publish Startup Profile'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
