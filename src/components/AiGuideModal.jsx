import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  RefreshCw, 
  Lightbulb,
  Building2,
  TrendingUp,
  Check,
  Copy,
  AlertCircle,
  BookOpen,
  Loader2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { AI_SUGGESTED_QUESTIONS, generateCustomAiResponse, AI_DISCLAIMER } from '../data/aiResponses';

export default function AiGuideModal({ 
  isOpen, 
  onClose, 
  initialRole = 'startup' 
}) {
  const [activeTab, setActiveTab] = useState(initialRole);
  const [inputQuery, setInputQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState(null);

  // Message histories for Startup Tunisia Guide & Investor Tunisia Guide
  const [messages, setMessages] = useState({
    startup: [
      {
        id: 'welcome-startup',
        sender: 'ai',
        title: 'Startup Tunisia Guide',
        content: `Marhaban! Welcome to the **Startup Tunisia Guide**. 

I provide verified RAG assistance for Tunisian entrepreneurs on legal structures (SARL/SUARL), RNE registration, pitch decks in TND for local angels & VCs, and financing options. 

Select one of the 5 suggested questions below or ask your own question!`,
        mode: 'demo',
        sources: [
          {
            title: "Common Corporate Legal Forms for Startups in Tunisia",
            category: "Business creation and registration",
            sourceLabel: "Educational draft — official verification required",
            verified: false
          },
          {
            title: "Overview of Early-Stage Funding Pathways in Tunisia",
            category: "Funding options",
            sourceLabel: "Educational draft — official verification required",
            verified: false
          }
        ],
        timestamp: 'Just now'
      }
    ],
    investor: [
      {
        id: 'welcome-investor',
        sender: 'ai',
        title: 'Investor Tunisia Guide',
        content: `Welcome to the **Investor Tunisia Guide**. 

I assist local angels, venture capital funds, corporate investors, and the Tunisian diaspora in evaluating deal flow, analyzing pitch decks in TND, evaluating founder traction, and mitigating regulatory and currency risks. 

Select a question below or enter your diligence query!`,
        mode: 'demo',
        sources: [
          {
            title: "Evaluating Team Independence and Technical Defensibility",
            category: "Investor due diligence",
            sourceLabel: "Educational draft — official verification required",
            verified: false
          },
          {
            title: "Core Documents for Pre-Investment Due Diligence",
            category: "Investor due diligence",
            sourceLabel: "Educational draft — official verification required",
            verified: false
          }
        ],
        timestamp: 'Just now'
      }
    ]
  });

  const chatEndRef = useRef(null);

  // Sync initial tab when reopened with a specific target role
  useEffect(() => {
    if (initialRole) {
      setActiveTab(initialRole);
    }
  }, [initialRole, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, activeTab, isOpen, isLoading]);

  if (!isOpen) return null;

  const currentQuestions = AI_SUGGESTED_QUESTIONS[activeTab] || [];
  const currentMessages = messages[activeTab] || [];

  /**
   * Send question to backend RAG API (POST /api/ai/guide)
   * Falls back gracefully to local answers if backend is unavailable
   */
  const executeQuery = async (queryText) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: trimmed,
      timestamp: 'Just now'
    };

    setMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMsg]
    }));

    setIsLoading(true);
    setLastFailedQuery(null);

    try {
      // Call backend RAG API
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: activeTab,
          question: trimmed
        })
      });

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        title: activeTab === 'startup' ? 'Startup Tunisia Guide' : 'Investor Tunisia Guide',
        content: data.answer,
        sources: data.sources || [],
        mode: data.mode || 'demo',
        timestamp: 'Just now'
      };

      setMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], aiMsg]
      }));
    } catch (err) {
      console.warn("Backend RAG fetch failed; activating client-side fallback:", err.message);
      
      // Client-side fallback to ensure zero downtime
      const fallbackResult = generateCustomAiResponse(activeTab, trimmed);
      
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        title: fallbackResult.title || (activeTab === 'startup' ? 'Startup Tunisia Guide' : 'Investor Tunisia Guide'),
        content: fallbackResult.body,
        sources: [
          {
            title: "Tunisia Ecosystem Guidance Knowledge Repository",
            category: activeTab === 'startup' ? "Business creation and registration" : "Investor due diligence",
            sourceLabel: "Educational draft — official verification required",
            verified: false
          }
        ],
        mode: 'demo',
        isErrorFallback: true,
        timestamp: 'Just now'
      };

      setMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], aiMsg]
      }));

      setLastFailedQuery(trimmed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestedQuestion = (item) => {
    executeQuery(item.question);
  };

  const handleSendCustomQuery = (e) => {
    e?.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    const query = inputQuery;
    setInputQuery('');
    executeQuery(query);
  };

  const handleRetryLastQuery = () => {
    if (lastFailedQuery) {
      executeQuery(lastFailedQuery);
    }
  };

  const handleResetChat = () => {
    setMessages(prev => ({
      ...prev,
      [activeTab]: [
        {
          id: `welcome-${activeTab}-${Date.now()}`,
          sender: 'ai',
          title: activeTab === 'startup' ? 'Startup Tunisia Guide' : 'Investor Tunisia Guide',
          content: activeTab === 'startup'
            ? 'Conversation reset. What Tunisian startup creation or fundraising question can I help you with?'
            : 'Conversation reset. What investment diligence or market evaluation question can I assist you with?',
          mode: 'demo',
          sources: [],
          timestamp: 'Just now'
        }
      ]
    }));
    setLastFailedQuery(null);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-violet-900/30 flex flex-col max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-[#0C1322] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  StartupBridge AI Tunisia RAG
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-blue-950 text-blue-300 border border-blue-700/50">
                  Tunisia Knowledge Base
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Grounding answers exclusively in Tunisian startup ecosystem sources.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
              aria-label="Close AI Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="px-6 pt-3 pb-2 bg-[#0A0F1D] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('startup')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'startup'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Startup Tunisia Guide</span>
            </button>
            
            <button
              onClick={() => setActiveTab('investor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'investor'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Investor Tunisia Guide</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>RAG Verified Knowledge Base</span>
          </div>
        </div>

        {/* Suggested Questions Pill Carousel (5 questions per role) */}
        <div className="px-6 py-3 bg-[#0A0F1D]/60 border-b border-slate-800/70 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-semibold flex-shrink-0">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              Suggested:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {currentQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectSuggestedQuestion(q)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700/80 hover:text-white border border-slate-700/60 hover:border-blue-500/50 transition-all cursor-pointer flex-shrink-0 disabled:opacity-50"
                >
                  {q.question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#080D18]">
          {currentMessages.map((msg) => {
            const isAi = msg.sender === 'ai';
            const isLive = msg.mode === 'live';
            const hasSources = isAi && msg.sources && msg.sources.length > 0;
            const hasUnverifiedSources = hasSources && msg.sources.some(s => s.verified === false);

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    isAi
                      ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
                      : 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className="max-w-[88%] sm:max-w-[82%] space-y-1.5">
                  
                  {isAi && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-violet-400">
                        {activeTab === 'startup' ? 'Startup Tunisia Guide' : 'Investor Tunisia Guide'}
                      </span>
                      
                      {/* Live AI Guidance badge vs Demo Guidance badge (Requirement 4) */}
                      {isLive ? (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1 shadow-sm shadow-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Live AI guidance
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/60">
                          Demo guidance
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400 ml-auto">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-800/90 text-slate-100 border border-slate-700/70 shadow-lg'
                        : 'bg-blue-600 text-white font-medium ml-auto shadow-md'
                    }`}
                  >
                    {isAi ? (
                      <div className="space-y-4">
                        {/* Answer Text */}
                        <div className="whitespace-pre-line text-slate-200 text-sm leading-relaxed">
                          {msg.content}
                        </div>

                        {/* Visible Sources Consulted Section (Requirement 4 & 5) */}
                        {hasSources && (
                          <div className="pt-3 border-t border-slate-700/70 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                              <span>Sources Consulted ({msg.sources.length}):</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.sources.map((src, idx) => (
                                <div 
                                  key={idx} 
                                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs space-y-1"
                                >
                                  <div className="font-semibold text-white line-clamp-1">
                                    {src.title}
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                                    <span className="text-blue-400">{src.category}</span>
                                    {src.verified ? (
                                      <span className="text-emerald-400 font-medium">✓ Verified</span>
                                    ) : (
                                      <span className="text-amber-400 font-medium">Draft</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Warning when no verified source is available (Requirement 4) */}
                            {hasUnverifiedSources && (
                              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-[11px] leading-tight flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong>Notice:</strong> The sources consulted are educational drafts pending official verification. Do not rely on them as certified legal or investment advice.
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions Strip */}
                        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                          <span className="text-[11px] italic text-slate-400">
                            Tunisian Knowledge Base Retrieval.
                          </span>
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading State Spinner (Requirement 5) */}
          {isLoading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 text-slate-300 text-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                <span>Searching Tunisia knowledge base & synthesizing guidance...</span>
              </div>
            </div>
          )}

          {/* Retry Button Banner if Error/Fallback occurred (Requirement 5) */}
          {lastFailedQuery && !isLoading && (
            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs flex items-center justify-between">
              <span>Used local Tunisia knowledge fallback. Would you like to retry the server call?</span>
              <button
                onClick={handleRetryLastQuery}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 sm:p-5 bg-[#0C1322] border-t border-slate-800">
          <form onSubmit={handleSendCustomQuery} className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              placeholder={
                activeTab === 'startup'
                  ? 'Ask about creating a SARL/SUARL, RNE registration, pitch decks, TND valuations...'
                  : 'Ask about founder evaluation, due diligence in Tunisia, currency risk, ticket sizes in TND...'
              }
              className="flex-1 bg-slate-800/90 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-violet-600/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Ask AI</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
            <span>RAG Engine: answers grounded in local Tunisian sources with automatic demo fallback.</span>
            <span className="hidden sm:inline">No API keys exposed in browser</span>
          </div>
        </div>
      </div>
    </div>
  );
}
