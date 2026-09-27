import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  TrendingUp, 
  Video, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  Lock, 
  Eye, 
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  getAdminStartups, 
  updateStartupAdminStatus, 
  getAdminInvestors, 
  updateInvestorAdminStatus, 
  getAuditLogs, 
  getPlatformUsers 
} from '../utils/adminStorage';
import { getAllMeetings } from '../utils/meetingStorage';
import { fetchAdminData, updateInvestorReview, updateStartupReview } from '../lib/supabaseData';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'startups' | 'investors' | 'meetings' | 'users' | 'logs'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [startups, setStartups] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  // Modal states for confirmation
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'startup' | 'investor'
    action: null, // 'approved' | 'rejected' | 'suspended' | 'changes' | 'documents'
    item: null,
    internalNote: '',
    founderFeedback: ''
  });

  const [notification, setNotification] = useState('');

  const loadAllData = async () => {
    setDataLoading(true);
    setDataError('');
    try {
      const data = await fetchAdminData().catch(() => null);
      if (data) {
        setStartups(data.startups || []);
        setInvestors(data.investors || []);
        setMeetings(data.meetings || []);
        setAuditLogs(data.logs || []);
        setUsers(data.profiles || []);
      } else {
        setStartups(getAdminStartups());
        setInvestors(getAdminInvestors());
        setMeetings(getAllMeetings());
        setAuditLogs(getAuditLogs());
        setUsers(getPlatformUsers());
      }
    } catch (err) {
      setDataError(err.message || 'Unable to load administration data.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Platform KPIs
  const totalUsers = users.length;
  const pendingStartups = startups.filter(s => s.publicationStatus === 'under_review').length;
  const pendingInvestors = investors.filter(i => i.verificationStatus === 'under_review').length;
  const approvedStartups = startups.filter(s => s.publicationStatus === 'approved').length;
  const approvedInvestors = investors.filter(i => i.verificationStatus === 'approved').length;
  const upcomingMeetings = meetings.filter(m => m.status === 'accepted').length;

  const handleOpenActionModal = (type, action, item) => {
    setConfirmModal({
      isOpen: true,
      type,
      action,
      item,
      internalNote: '',
      founderFeedback: action === 'approved' 
        ? 'Your file has been approved by the StartupY committee.' 
        : 'Please update your submission documentation according to administrative guidelines.'
    });
  };

  const handleConfirmDecision = async () => {
    const { type, action, item, internalNote, founderFeedback } = confirmModal;
    if (!item) return;

    if (type === 'startup') {
      let newStatus = action;
      if (action === 'changes') newStatus = 'under_review';
      try {
        await updateStartupReview(item.id, newStatus, founderFeedback || internalNote);
      } catch {
        updateStartupAdminStatus(item.id, newStatus, internalNote, founderFeedback);
      }
      setNotification(`Startup decision recorded: ${item.name} status updated to ${newStatus}.`);
    } else if (type === 'investor') {
      let newStatus = action;
      if (action === 'documents') newStatus = 'documents_required';
      try {
        await updateInvestorReview(item.id, newStatus, internalNote);
      } catch {
        updateInvestorAdminStatus(item.id, newStatus, internalNote);
      }
      setNotification(`Investor decision recorded: ${item.name} status updated to ${newStatus}.`);
    }

    setConfirmModal({ isOpen: false, type: null, action: null, item: null, internalNote: '', founderFeedback: '' });
    await loadAllData();
    setTimeout(() => setNotification(''), 4500);
  };

  const handleDemoData = async (method) => {
    setNotification('');
    setDataError('');
    try {
      const response = await fetch('/api/dev/seed-demo', {
        method,
        headers: { Authorization: `Bearer ${session?.access_token || ''}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Demo data operation failed.');
      setNotification(method === 'POST' ? 'Development demo data seeded.' : 'Development demo data cleared.');
      await loadAllData();
    } catch (err) {
      setDataError(err.message);
    }
  };

  if (dataLoading) return <div className="mx-auto max-w-7xl px-6 py-16"><div className="h-56 animate-pulse rounded-lg border border-sand bg-surface" /></div>;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-ink">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sand">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning-bg text-warning border border-warning/30 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-warning" />
            <span>Direction Générale & Governance Console</span>
            <span className="text-taupe">•</span>
            <span className="text-brown-mid font-semibold">StartupY Admin</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            Institutional Administration
          </h1>
          <p className="text-sm text-muted mt-1">
            Review Tunisian startup publications, accredit institutional investors, monitor meetings, and inspect audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-surface-elevated border border-sand text-xs text-brown-mid font-mono flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block mr-2 animate-pulse"></span>
            RLS Enforcement Active
          </div>
        </div>
      </div>

      {dataError && (
        <div className="rounded-lg border border-danger/30 bg-danger-bg p-4 text-sm text-danger">
          {dataError} <button onClick={loadAllData} className="ml-2 underline">Retry</button>
        </div>
      )}

      {import.meta.env.DEV && (
        <div className="flex flex-col gap-4 rounded-lg border border-warning/30 bg-warning-bg p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm font-medium text-warning">Django Backend Management</p><p className="mt-1 text-xs text-muted">Backend powered by Django REST Framework & PostgreSQL.</p></div>
          <div className="flex gap-2"><button onClick={() => loadAllData()} className="rounded-md bg-coral px-4 py-2 text-xs font-medium text-white hover:bg-coral-dark transition-colors cursor-pointer">Refresh Platform Data</button></div>
        </div>
      )}

      {notification && (
        <div className="p-4 rounded-lg bg-coral/10 border border-coral/40 text-xs text-coral flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-muted hover:text-ink cursor-pointer">✕</button>
        </div>
      )}

      {/* 6 Platform Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-4 rounded-xl bg-surface-elevated border border-sand shadow-sm hover:border-sand/80 transition-all">
          <div className="text-xs text-muted font-medium">Total Users</div>
          <div className="text-2xl font-bold text-ink mt-1">{totalUsers}</div>
          <div className="text-[11px] text-coral font-medium mt-0.5">Founders & Angels</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-sand shadow-sm hover:border-sand/80 transition-all">
          <div className="text-xs text-muted font-medium">Startups Review</div>
          <div className="text-2xl font-bold text-amber-800 mt-1">{pendingStartups}</div>
          <div className="text-[11px] text-muted mt-0.5">Awaiting decision</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-sand shadow-sm hover:border-sand/80 transition-all">
          <div className="text-xs text-muted font-medium">Investors Verify</div>
          <div className="text-2xl font-bold text-amber-800 mt-1">{pendingInvestors}</div>
          <div className="text-[11px] text-muted mt-0.5">Awaiting dossiers</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-sand shadow-sm hover:border-sand/80 transition-all">
          <div className="text-xs text-muted font-medium">Approved Startups</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{approvedStartups}</div>
          <div className="text-[11px] text-muted mt-0.5">Published deal flow</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-sand shadow-sm hover:border-sand/80 transition-all">
          <div className="text-xs text-muted font-medium">Accredited Funds</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{approvedInvestors}</div>
          <div className="text-[11px] text-muted mt-0.5">Verified investors</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-sand shadow-sm hover:border-sand/80 transition-all">
          <div className="text-xs text-muted font-medium">Active Meetings</div>
          <div className="text-2xl font-bold text-coral mt-1">{upcomingMeetings}</div>
          <div className="text-[11px] text-muted mt-0.5">StartupY video calls</div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-sand pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'startups', label: `Startup Review (${pendingStartups})` },
          { id: 'investors', label: `Investor Verification (${pendingInvestors})` },
          { id: 'meetings', label: `Meetings (${meetings.length})` },
          { id: 'users', label: `Users (${users.length})` },
          { id: 'logs', label: `Audit Logs (${auditLogs.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs font-semibold ${
              activeTab === tab.id
                ? 'bg-coral text-white shadow-sm'
                : 'text-brown-mid hover:text-ink hover:bg-surface border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Audit Trail Preview */}
          <div className="bg-surface-elevated rounded-xl p-6 sm:p-7 border border-sand shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Clock className="w-4 h-4 text-coral" />
                <span>Recent Platform Activity Feed</span>
              </h3>
              <button onClick={() => setActiveTab('logs')} className="text-xs font-semibold text-coral hover:text-coral-dark hover:underline cursor-pointer">
                View All Logs
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map(log => (
                <div key={log.id} className="p-3.5 rounded-lg bg-surface border border-sand text-xs space-y-1 hover:border-sand/90 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-800 font-mono text-[11px] bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300/60">{log.action}</span>
                    <span className="text-[10px] text-muted">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-ink font-medium">
                    Target: <strong className="text-ink font-bold">{log.entityName}</strong> <span className="text-muted">({log.entityType})</span>
                  </div>
                  {log.metadata && (
                    <div className="text-[11px] text-muted italic">
                      {JSON.stringify(log.metadata).replace(/[{}"]/g, ' ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Pending Summary */}
          <div className="bg-surface-elevated rounded-xl p-6 sm:p-7 border border-sand shadow-sm space-y-4">
            <h3 className="text-base font-bold text-ink flex items-center gap-2 pb-3 border-b border-sand">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Priority Action Items</span>
            </h3>

            <div className="space-y-3">
              {startups.filter(s => s.publicationStatus === 'under_review').slice(0, 2).map(s => (
                <div key={s.id} className="p-4 rounded-lg bg-surface border border-sand flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-ink">{s.name}</div>
                    <div className="text-xs text-muted">{s.sector} • {s.governorate} • Seeking {s.fundingNeeded}</div>
                    <div className="text-[11px] text-amber-800 font-semibold mt-1">Readiness Score: {s.readinessScore || 85}%</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('startups')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-coral hover:bg-coral-dark shadow-sm transition-colors cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              ))}

              {investors.filter(i => i.verificationStatus === 'under_review').slice(0, 2).map(inv => (
                <div key={inv.id} className="p-4 rounded-lg bg-surface border border-sand flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-ink">{inv.name}</div>
                    <div className="text-xs text-muted">{inv.type} • Ticket {inv.budgetRange}</div>
                    <div className="text-[11px] text-coral font-semibold mt-1">Dossier complete with RNE</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('investors')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-coral hover:bg-coral-dark shadow-sm transition-colors cursor-pointer"
                  >
                    Accredit
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Startup Review */}
      {activeTab === 'startups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 pb-2">
            <div className="text-xs text-muted">
              Inspect candidate startups, assess 11-step roadmap compliance, and issue institutional publication decisions.
            </div>
          </div>

          <div className="space-y-3.5">
            {startups.map(s => {
              const isApproved = s.publicationStatus === 'approved';
              const isPending = s.publicationStatus === 'under_review';

              return (
                <div key={s.id} className="p-5 rounded-lg bg-surface-elevated border border-sand flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isApproved ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        isPending ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-surface text-muted border-sand'
                      }`}>
                        {s.publicationStatus}
                      </span>
                      <span className="text-xs text-muted">{s.sector} • {s.stage}</span>
                      <span className="text-xs text-coral font-semibold">{s.governorate}, Tunisia</span>
                      <span className="text-xs text-brown-mid font-bold">Target: {s.fundingNeeded}</span>
                    </div>

                    <h4 className="text-base font-bold text-ink flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-coral" />
                      <span>{s.name}</span>
                    </h4>

                    <p className="text-xs text-brown-mid max-w-2xl">
                      {s.pitch}
                    </p>

                    <div className="pt-1 text-[11px] text-muted flex items-center gap-4">
                      <span>Internal note: <strong className="text-brown-mid">{s.reviewerNote}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/startup/${s.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink bg-surface border border-sand hover:bg-sand/40 transition-colors"
                      target="_blank"
                    >
                      Inspect Profile
                    </Link>

                    <button
                      onClick={() => handleOpenActionModal('startup', 'approved', s)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors cursor-pointer"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleOpenActionModal('startup', 'changes', s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-brown-mid bg-surface hover:bg-sand/50 border border-sand transition-colors cursor-pointer"
                    >
                      Request Changes
                    </button>

                    <button
                      onClick={() => handleOpenActionModal('startup', 'rejected', s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-danger hover:bg-danger-bg border border-danger/20 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Investor Verification */}
      {activeTab === 'investors' && (
        <div className="space-y-4">
          <div className="text-xs text-muted pb-2">
            Verify angel syndicates, institutional venture funds, and corporate investors deploying capital in TND.
          </div>

          <div className="space-y-3.5">
            {investors.map(inv => {
              const isApproved = inv.verificationStatus === 'approved';
              const isPending = inv.verificationStatus === 'under_review';

              return (
                <div key={inv.id} className="p-5 rounded-lg bg-surface-elevated border border-sand flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isApproved ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        isPending ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-surface text-muted border-sand'
                      }`}>
                        {inv.verificationStatus}
                      </span>
                      <span className="text-xs text-coral font-semibold">{inv.type}</span>
                      <span className="text-xs text-brown-mid font-bold">Ticket: {inv.budgetRange}</span>
                    </div>

                    <h4 className="text-base font-bold text-ink flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-coral" />
                      <span>{inv.name}</span>
                    </h4>

                    <p className="text-xs text-brown-mid max-w-2xl">
                      {inv.bio || 'Deploying smart capital in Tunisian Dinars across early stage ventures.'}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                      {(inv.documents || []).map((doc, dIdx) => (
                        <span key={dIdx} className="px-2 py-0.5 rounded-lg bg-surface text-brown-mid border border-sand flex items-center gap-1">
                          <FileText className="w-3 h-3 text-coral" />
                          <span>{doc.type}</span>
                          <span className={doc.verified ? 'text-emerald-700 font-bold' : 'text-amber-800'}>
                            {doc.verified ? '✓' : 'Pending'}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleOpenActionModal('investor', 'approved', inv)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors cursor-pointer"
                    >
                      Approve Accreditation
                    </button>

                    <button
                      onClick={() => handleOpenActionModal('investor', 'documents', inv)}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-brown-mid bg-surface hover:bg-sand/50 border border-sand transition-colors cursor-pointer"
                    >
                      Request Documents
                    </button>

                    <button
                      onClick={() => handleOpenActionModal('investor', 'rejected', inv)}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-danger hover:bg-danger-bg border border-danger/20 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Meetings (Metadata Only - Requirement 6) */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-surface-elevated border border-sand text-xs text-muted flex items-center gap-2">
            <Lock className="w-4 h-4 text-coral flex-shrink-0" />
            <span>
              <strong>Confidentiality Notice:</strong> Administrators can inspect meeting metadata only (participants, date, duration, room ID, and status). Audio, video, and private chat content are never recorded or stored.
            </span>
          </div>

          <div className="space-y-3">
            {meetings.map(m => (
              <div key={m.id} className="p-4 rounded-lg bg-surface-elevated border border-sand flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold text-ink text-sm sm:text-base">
                    <Video className="w-4 h-4 text-coral" />
                    <span>{m.startupName} ↔ {m.investorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-brown-mid border border-sand font-medium">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-muted">
                    Scheduled: {new Date(m.scheduledAt).toLocaleString()} • Duration: {m.durationMinutes} mins • Room: <span className="font-mono text-brown-mid">{m.roomId}</span>
                  </div>
                  <div className="text-muted">
                    Agenda: {m.agenda}
                  </div>
                </div>

                <div className="text-xs text-brown-mid font-mono font-medium">
                  {m.outcomeStatus ? `Outcome: ${m.outcomeStatus}` : 'No outcome reported'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Users */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="text-xs text-muted pb-1">
            Registered platform accounts across Tunisian governorates.
          </div>

          <div className="overflow-x-auto rounded-lg border border-sand bg-surface-elevated shadow-sm">
            <table className="w-full text-left text-xs text-brown-mid">
              <thead className="bg-surface text-muted font-bold border-b border-sand uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Governorate</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-surface/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-ink">
                      <div>{u.name}</div>
                      <div className="text-[11px] text-muted font-normal">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        u.role === 'startup' ? 'bg-coral/10 text-coral border-coral/30' :
                        'bg-coral/10 text-coral border-coral/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-ink">{u.org}</td>
                    <td className="py-3.5 px-4 text-ink">{u.governorate}</td>
                    <td className="py-3.5 px-4 text-muted">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="text-xs text-muted pb-1">
            Immutable administrative action logs with timestamp and actor tracking.
          </div>

          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 rounded-lg bg-surface-elevated border border-sand text-xs space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-800 font-mono text-[11px] bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300/60">
                      {log.action}
                    </span>
                    <span className="text-ink font-semibold">{log.entityName}</span>
                    <span className="text-[10px] text-muted uppercase">({log.entityType})</span>
                  </div>
                  <span className="text-muted text-[11px]">{new Date(log.createdAt).toLocaleString()}</span>
                </div>

                <div className="text-muted flex items-center justify-between">
                  <span>Actor: <strong className="text-ink">{log.actorName}</strong></span>
                  {log.metadata && (
                    <span className="font-mono text-[10px] text-muted truncate max-w-md">
                      {JSON.stringify(log.metadata)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Action Confirmation Modal (Requirement 6) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-elevated border border-sand rounded-xl max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-5 text-ink">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Administrative Confirmation
              </span>
              <h3 className="text-xl font-bold text-ink">
                Confirm {confirmModal.action?.toUpperCase()} Decision
              </h3>
              <p className="text-xs text-muted">
                You are about to issue a formal administrative decision for <strong className="text-ink">{confirmModal.item?.name}</strong>.
              </p>
            </div>

            {/* Internal Reviewer Note */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink">
                Internal Reviewer Note (Confidential to Admins):
              </label>
              <textarea
                rows={2}
                value={confirmModal.internalNote}
                onChange={(e) => setConfirmModal(prev => ({ ...prev, internalNote: e.target.value }))}
                placeholder="Internal verification rationale or compliance notes..."
                className="w-full rounded-md border border-sand bg-surface px-3.5 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
            </div>

            {/* User-facing Feedback (for startups) */}
            {confirmModal.type === 'startup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">
                  Feedback to Founder (User-facing):
                </label>
                <textarea
                  rows={2}
                  value={confirmModal.founderFeedback}
                  onChange={(e) => setConfirmModal(prev => ({ ...prev, founderFeedback: e.target.value }))}
                  placeholder="Message visible to the founder on their dashboard..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-sand text-xs text-ink focus:outline-none focus:ring-2 focus:ring-coral/30"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, type: null, action: null, item: null, internalNote: '', founderFeedback: '' })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted hover:text-ink bg-surface border border-sand/60 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-coral hover:bg-coral-dark shadow-sm transition-all cursor-pointer"
              >
                Confirm Decision & Record in Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
