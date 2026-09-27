import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';
import StartupCard from '../components/StartupCard';
import { fetchApprovedStartups } from '../lib/supabaseData';

const Select = ({ value, onChange, label, options }) => (
  <label className="space-y-1 text-xs font-medium text-muted">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-sand bg-surface-elevated px-3 py-2.5 text-sm text-ink">
      <option value="All">All</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

export default function ExplorePage() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [stage, setStage] = useState('All');
  const [governorate, setGovernorate] = useState('All');
  const [fundingType, setFundingType] = useState('All');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApprovedStartups();
      setStartups(data || []);
    } catch (err) {
      setStartups([]);
      setError(err.message || 'Unable to load approved startups.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const values = (field) => [...new Set(startups.map((item) => item[field]).filter(Boolean))].sort();
  const filtered = useMemo(() => startups.filter((item) => {
    const query = search.trim().toLowerCase();
    if (query && ![item.name, item.pitch, item.sector, item.governorate].some((value) => value?.toLowerCase().includes(query))) return false;
    if (sector !== 'All' && item.sector !== sector) return false;
    if (stage !== 'All' && item.stage !== stage) return false;
    if (governorate !== 'All' && item.governorate !== governorate) return false;
    if (fundingType !== 'All' && item.fundingTypeSought !== fundingType) return false;
    return true;
  }), [startups, search, sector, stage, governorate, fundingType]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-coral">Deal flow approuvé</p>
          <h1 className="mt-2 text-4xl">Startups tunisiennes</h1>
          <p className="mt-2 text-sm text-muted">Profils validés et accessibles aux investisseurs approuvés.</p>
        </div>
        <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-md border border-sand bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:border-coral/40 disabled:opacity-50"><RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />Actualiser</button>
      </div>

      <div className="mb-8 rounded-lg border border-sand bg-surface-elevated p-5 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 size-4 text-taupe" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une startup, un secteur ou une région…" className="w-full rounded-md border border-sand bg-surface px-10 py-2.5 text-sm text-ink focus:border-coral" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Sector" value={sector} onChange={setSector} options={values('sector')} />
          <Select label="Stage" value={stage} onChange={setStage} options={values('stage')} />
          <Select label="Governorate" value={governorate} onChange={setGovernorate} options={values('governorate')} />
          <Select label="Funding type" value={fundingType} onChange={setFundingType} options={values('fundingTypeSought')} />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-72 animate-pulse rounded-lg border border-sand bg-surface" />)}</div>
      ) : error ? (
        <div className="rounded-lg border border-danger/30 bg-danger-bg p-8 text-center"><AlertCircle className="mx-auto size-6 text-danger" /><p className="mt-3 text-sm text-danger">{error}</p><button onClick={load} className="mt-4 rounded-md bg-coral px-4 py-2 text-sm font-medium text-white">Retry</button></div>
      ) : startups.length === 0 ? (
        <div className="rounded-lg border border-sand bg-surface-elevated p-12 text-center shadow-sm"><h2 className="text-2xl">No approved startups are available yet.</h2><p className="mt-2 text-sm text-muted">New startup profiles will appear here after review.</p></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-sand bg-surface p-10 text-center text-sm text-muted">No startups match the selected filters.</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((startup) => <StartupCard key={startup.id} startup={startup} />)}</div>
      )}
    </div>
  );
}
