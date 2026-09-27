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

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'startups' | 'investors' | 'meetings' | 'users' | 'logs'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [startups, setStartups] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);

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

  const loadAllData = () => {
    setStartups(getAdminStartups());
    setInvestors(getAdminInvestors());
    setMeetings(getAllMeetings());
    setAuditLogs(getAuditLogs());
    setUsers(getPlatformUsers());
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
        ? 'Your file has been approved by the Bidaya committee.' 
        : 'Please update your submission documentation according to administrative guidelines.'
    });
  };

  const handleConfirmDecision = () => {
    const { type, action, item, internalNote, founderFeedback } = confirmModal;
    if (!item) return;

    if (type === 'startup') {
      let newStatus = action;
      if (action === 'changes') newStatus = 'under_review';
      updateStartupAdminStatus(item.id, newStatus, internalNote, founderFeedback);
      setNotification(`Startup decision recorded: ${item.name} status updated to ${newStatus}.`);
    } else if (type === 'investor') {
      let newStatus = action;
      if (action === 'documents') newStatus = 'documents_required';
      updateInvestorAdminStatus(item.id, newStatus, internalNote);
      setNotification(`Investor decision recorded: ${item.name} status updated to ${newStatus}.`);
    }

    setConfirmModal({ isOpen: false, type: null, action: null, item: null, internalNote: '', founderFeedback: '' });
    loadAllData();
    setTimeout(() => setNotification(''), 4500);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-100">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Direction Générale & Governance Console</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Bidaya Tunisia Admin</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Institutional Administration
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review Tunisian startup publications, accredit institutional investors, monitor meetings, and inspect audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-2 animate-pulse"></span>
            RLS Enforcement Active
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-blue-950/80 border border-blue-500/40 text-xs text-blue-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 6 Platform Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="text-xs text-slate-400 font-semibold">Total Users</div>
          <div className="text-2xl font-black text-white mt-1">{totalUsers}</div>
          <div className="text-[11px] text-blue-400 mt-0.5">Founders & Angels</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="text-xs text-slate-400 font-semibold">Startups Review</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{pendingStartups}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting decision</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="text-xs text-slate-400 font-semibold">Investors Verify</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{pendingInvestors}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting dossiers</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="text-xs text-slate-400 font-semibold">Approved Startups</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{approvedStartups}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Published deal flow</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="text-xs text-slate-400 font-semibold">Accredited Funds</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{approvedInvestors}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verified investors</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="text-xs text-slate-400 font-semibold">Active Meetings</div>
          <div className="text-2xl font-black text-violet-400 mt-1">{upcomingMeetings}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Bidaya video calls</div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
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
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Recent Platform Activity Feed</span>
              </h3>
              <button onClick={() => setActiveTab('logs')} className="text-xs text-blue-400 hover:underline">
                View All Logs
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map(log => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 font-mono text-[11px]">{log.action}</span>
                    <span className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-200">
                    Target: <strong>{log.entityName}</strong> ({log.entityType})
                  </div>
                  {log.metadata && (
                    <div className="text-[11px] text-slate-400 italic">
                      {JSON.stringify(log.metadata).replace(/[{}"]/g, ' ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Pending Summary */}
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Priority Action Items</span>
            </h3>

            <div className="space-y-3">
              {startups.filter(s => s.publicationStatus === 'under_review').slice(0, 2).map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-white">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.sector} • {s.governorate} • Seeking {s.fundingNeeded}</div>
                    <div className="text-[11px] text-amber-400 font-semibold mt-1">Readiness Score: {s.readinessScore || 85}%</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('startups')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500"
                  >
                    Review
                  </button>
                </div>
              ))}

              {investors.filter(i => i.verificationStatus === 'under_review').slice(0, 2).map(inv => (
                <div key={inv.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-white">{inv.name}</div>
                    <div className="text-xs text-slate-400">{inv.type} • Ticket {inv.budgetRange}</div>
                    <div className="text-[11px] text-violet-400 font-semibold mt-1">Dossier complete with RNE</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('investors')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500"
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
            <div className="text-xs text-slate-400">
              Inspect candidate startups, assess 11-step roadmap compliance, and issue institutional publication decisions.
            </div>
          </div>

          <div className="space-y-3.5">
            {startups.map(s => {
              const isApproved = s.publicationStatus === 'approved';
              const isPending = s.publicationStatus === 'under_review';

              return (
                <div key={s.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isApproved ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        isPending ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {s.publicationStatus}
                      </span>
                      <span className="text-xs text-slate-400">{s.sector} • {s.stage}</span>
                      <span className="text-xs text-blue-400 font-semibold">{s.governorate}, Tunisia</span>
                      <span className="text-xs text-slate-300 font-bold">Target: {s.fundingNeeded}</span>
                    </div>

                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <span>{s.name}</span>
                    </h4>

                    <p className="text-xs text-slate-300 max-w-2xl">
                      {s.pitch}
                    </p>

                    <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-4">
                      <span>Internal note: <strong className="text-slate-300">{s.reviewerNote}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/startup/${s.id}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:text-white transition-colors"
                      target="_blank"
                    >
                      Inspect Profile
                    </Link>

                    <button
                      onClick={() => handleOpenActionModal('startup', 'approved', s)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleOpenActionModal('startup', 'changes', s)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      Request Changes
                    </button>

                    <button
                      onClick={() => handleOpenActionModal('startup', 'rejected', s)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/60 transition-colors"
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
          <div className="text-xs text-slate-400 pb-2">
            Verify angel syndicates, institutional venture funds, and corporate investors deploying capital in TND.
          </div>

          <div className="space-y-3.5">
            {investors.map(inv => {
              const isApproved = inv.verificationStatus === 'approved';
              const isPending = inv.verificationStatus === 'under_review';

              return (
                <div key={inv.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isApproved ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        isPending ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {inv.verificationStatus}
                      </span>
                      <span className="text-xs text-violet-400 font-semibold">{inv.type}</span>
                      <span className="text-xs text-slate-300 font-bold">Ticket: {inv.budgetRange}</span>
                    </div>

                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-violet-400" />
                      <span>{inv.name}</span>
                    </h4>

                    <p className="text-xs text-slate-300 max-w-2xl">
                      {inv.bio || 'Deploying smart capital in Tunisian Dinars across early stage ventures.'}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                      {(inv.documents || []).map((doc, dIdx) => (
                        <span key={dIdx} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-violet-400" />
                          <span>{doc.type}</span>
                          <span className={doc.verified ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {doc.verified ? '✓' : 'Pending'}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleOpenActionModal('investor', 'approved', inv)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                    >
                      Approve Accreditation
                    </button>

                    <button
                      onClick={() => handleOpenActionModal('investor', 'documents', inv)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      Request Documents
                    </button>

                    <button
                      onClick={() => handleOpenActionModal('investor', 'rejected', inv)}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/60 transition-colors"
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
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-violet-400 flex-shrink-0" />
            <span>
              <strong>Confidentiality Notice:</strong> Administrators can inspect meeting metadata only (participants, date, duration, room ID, and status). Audio, video, and private chat content are never recorded or stored.
            </span>
          </div>

          <div className="space-y-3">
            {meetings.map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span>{m.startupName} ↔ {m.investorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Scheduled: {new Date(m.scheduledAt).toLocaleString()} • Duration: {m.durationMinutes} mins • Room: <span className="font-mono text-slate-300">{m.roomId}</span>
                  </div>
                  <div className="text-slate-400">
                    Agenda: {m.agenda}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono">
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
          <div className="text-xs text-slate-400 pb-1">
            Registered platform accounts across Tunisian governorates.
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Governorate</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{u.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        u.role === 'startup' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                        'bg-violet-500/20 text-violet-300 border-violet-500/40'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{u.org}</td>
                    <td className="py-3.5 px-4">{u.governorate}</td>
                    <td className="py-3.5 px-4 text-slate-500">{u.joined}</td>
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
          <div className="text-xs text-slate-400 pb-1">
            Immutable administrative action logs with timestamp and actor tracking.
          </div>

          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400 font-mono text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      {log.action}
                    </span>
                    <span className="text-slate-300 font-semibold">{log.entityName}</span>
                    <span className="text-[10px] text-slate-500 uppercase">({log.entityType})</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{new Date(log.createdAt).toLocaleString()}</span>
                </div>

                <div className="text-slate-400 flex items-center justify-between">
                  <span>Actor: <strong className="text-slate-300">{log.actorName}</strong></span>
                  {log.metadata && (
                    <span className="font-mono text-[10px] text-slate-500 truncate max-w-md">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/60">
                Administrative Confirmation
              </span>
              <h3 className="text-xl font-black text-white">
                Confirm {confirmModal.action?.toUpperCase()} Decision
              </h3>
              <p className="text-xs text-slate-300">
                You are about to issue a formal administrative decision for <strong>{confirmModal.item?.name}</strong>.
              </p>
            </div>

            {/* Internal Reviewer Note */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Internal Reviewer Note (Confidential to Admins):
              </label>
              <textarea
                rows={2}
                value={confirmModal.internalNote}
                onChange={(e) => setConfirmModal(prev => ({ ...prev, internalNote: e.target.value }))}
                placeholder="Internal verification rationale or compliance notes..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* User-facing Feedback (for startups) */}
            {confirmModal.type === 'startup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Feedback to Founder (User-facing):
                </label>
                <textarea
                  rows={2}
                  value={confirmModal.founderFeedback}
                  onChange={(e) => setConfirmModal(prev => ({ ...prev, founderFeedback: e.target.value }))}
                  placeholder="Message visible to the founder on their dashboard..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, type: null, action: null, item: null, internalNote: '', founderFeedback: '' })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/30 transition-all cursor-pointer"
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
