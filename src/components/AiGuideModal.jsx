import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  RefreshCw, 
  Building2, 
  TrendingUp, 
  ShieldCheck,
  Check, 
  Copy, 
  BookOpen, 
  Loader2, 
  AlertTriangle, 
  RotateCcw,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { AI_SUGGESTED_QUESTIONS, AI_DISCLAIMER } from '../data/aiResponses';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AiGuideModal({ 
  isOpen, 
  onClose, 
  initialRole = 'startup' 
}) {
  const { user } = useAuth();
  const effectiveRole = user?.role || initialRole || 'startup';
  
  const [activeTab, setActiveTab] = useState(effectiveRole);
  const [inputQuery, setInputQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Message histories for Startup, Investor, and Admin roles
  const [messages, setMessages] = useState({
    startup: [
      {
        id: 'welcome-startup',
        sender: 'ai',
        title: 'Guide Startup Tunisie (Qdrant RAG)',
        content: `Marhaban ! Bienvenue sur le **Guide Startup Tunisie**. 

Je réponds avec précision sur le **Startup Act (Loi 2018-20)**, les critères d'éligibilité au label, la **Bourse de Startup** (jusqu'à 5 000 TND/mois), les formes juridiques (SARL/SUARL), l'immatriculation au RNE et les comptes spéciaux en devises.

Posez une question ou sélectionnez l'une des suggestions ci-dessous !`,
        sources: [
          {
            title: "Tunisian Startup Act: Law No. 2018-20 Overview and 5 Label Criteria",
            source: "Journal Officiel de la République Tunisienne / Startup Tunisia",
            url: "https://startup.gov.tn/en/startup-act"
          },
          {
            title: "Startup Act Incentives: Founder Leave, Startup Grant, and Social Security",
            source: "Smart Capital / Ministère des Technologies de la Communication",
            url: "https://startup.gov.tn/en/incentives/founders"
          }
        ],
        timestamp: 'À l\'instant'
      }
    ],
    investor: [
      {
        id: 'welcome-investor',
        sender: 'ai',
        title: 'Guide Investisseur Tunisie (Qdrant RAG)',
        content: `Bienvenue sur le **Guide Investisseur Tunisie**. 

Je vous assiste dans votre due diligence : avantages fiscaux sur les bénéfices réinvestis (dégrèvement total), exonération sur les plus-values de cession, tickets moyens en TND et mécanismes de protection des devises via la Banque Centrale de Tunisie (BCT).

Posez une question ou choisissez un sujet ci-dessous !`,
        sources: [
          {
            title: "Tax Incentives for Investors and Business Angels under the Startup Act",
            source: "Tunisian Investment Authority (TIA) / Ministère des Finances",
            url: "https://startup.gov.tn/en/incentives/investors"
          },
          {
            title: "Financing Ecosystem in Tunisia: AIR, ANAVA Fund of Funds, and Seed Grants",
            source: "Smart Capital / Caisse des Dépôts et Consignations (CDC)",
            url: "https://smartcapital.tn/anava"
          }
        ],
        timestamp: 'À l\'instant'
      }
    ],
    admin: [
      {
        id: 'welcome-admin',
        sender: 'ai',
        title: 'Guide Administratif & Écosystème (Qdrant RAG)',
        content: `Bienvenue sur le **Guide Réglementaire & Écosystème**. 

Accédez à l'ensemble des textes officiels indexés dans Qdrant : procédures INNORPI, facilités douanières, fonds ANAVA et conformité légale.`,
        sources: [
          {
            title: "Tunisian Innovation Ecosystem: Accelerators, Technoparks, and The Dot",
            source: "The Dot Tunisia / Smart Capital",
            url: "https://thedot.tn"
          }
        ],
        timestamp: 'À l\'instant'
      }
    ]
  });

  const chatEndRef = useRef(null);

  // Sync tab with user role if initialRole changes
  useEffect(() => {
    if (initialRole && ['startup', 'investor', 'admin'].includes(initialRole)) {
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

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => onClose?.('open')}
        className="fixed bottom-5 right-5 z-[80] flex size-14 items-center justify-center rounded-full bg-coral text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral sm:bottom-7 sm:right-7 cursor-pointer"
        aria-label="Ouvrir l'assistant IA RAG Bidaya"
      >
        <Bot className="size-6" />
      </button>
    );
  }

  const currentQuestions = AI_SUGGESTED_QUESTIONS[activeTab] || AI_SUGGESTED_QUESTIONS.startup || [];
  const currentMessages = messages[activeTab] || [];

  /**
   * Send question to backend RAG API (POST /api/chat)
   * Connects to Qdrant vector retrieval + LLM synthesis
   */
  const executeQuery = async (queryText) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: trimmed,
      timestamp: 'À l\'instant'
    };

    setMessages(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), userMsg]
    }));

    setIsLoading(true);
    setLastFailedQuery(null);
    setErrorMessage(null);

    try {
      // Call backend RAG pipeline POST /api/chat
      const data = await api.chat.sendMessage(trimmed, activeTab);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        title: activeTab === 'investor' 
          ? 'Guide Investisseur Tunisie' 
          : (activeTab === 'admin' ? 'Guide Plateforme & Écosystème' : 'Guide Startup Tunisie'),
        content: data.answer || "Aucune réponse générée.",
        sources: Array.isArray(data.sources) ? data.sources : [],
        timestamp: 'À l\'instant'
      };

      setMessages(prev => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] || []), aiMsg]
      }));
    } catch (err) {
      console.error("RAG Chat API error:", err);
      setErrorMessage(err.message || "Erreur de communication avec le serveur RAG.");
      setLastFailedQuery(trimmed);

      const errorAiMsg = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        title: 'Erreur de connexion',
        content: "Désolé, impossible d'interroger la base de connaissances Qdrant pour le moment. Veuillez vérifier votre connexion ou réessayer.",
        sources: [],
        isError: true,
        timestamp: 'À l\'instant'
      };

      setMessages(prev => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] || []), errorAiMsg]
      }));
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
          title: activeTab === 'investor' 
            ? 'Guide Investisseur Tunisie' 
            : (activeTab === 'admin' ? 'Guide Administratif' : 'Guide Startup Tunisie'),
          content: activeTab === 'startup'
            ? 'Conversation réinitialisée. Quelle question sur le Startup Act, le RNE ou les financements puis-je vous éclairer ?'
            : 'Conversation réinitialisée. Quelle question de due diligence ou de réglementation souhaitez-vous explorer ?',
          sources: [],
          timestamp: 'À l\'instant'
        }
      ]
    }));
    setLastFailedQuery(null);
    setErrorMessage(null);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex items-end justify-end sm:bottom-7 sm:right-7">
      <div 
        className="pointer-events-auto flex h-[min(650px,82vh)] w-[min(460px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-sand bg-surface-elevated shadow-2xl transition-all"
        role="complementary"
        aria-label="Assistant RAG StartupY"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-sand px-4 py-3 bg-surface">
          <div className="flex items-center gap-3">
            <div className="relative flex size-9 items-center justify-center rounded-xl bg-coral text-white shadow-md">
              <Bot className="size-5" />
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-surface"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-ink">
                  Assistant IA StartupY
                </h3>
                <span className="rounded bg-coral/10 px-1.5 py-0.5 text-[10px] font-bold text-coral uppercase tracking-wide">
                  Guide Officiel
                </span>
              </div>
              <p className="text-[0.6875rem] text-taupe">
                Connaissances vérifiées · Écosystème Tunisie
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-1.5 text-muted hover:text-ink hover:bg-sand/30 rounded-lg transition-colors cursor-pointer"
              title="Réinitialiser la conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-ink hover:bg-sand/30 rounded-lg transition-colors cursor-pointer"
              aria-label="Fermer le guide IA"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="flex items-center justify-between border-b border-sand px-3 py-2 bg-surface/50">
          <div className="flex items-center gap-1 rounded-lg bg-surface border border-sand/40 p-0.5 w-full">
            <button
              onClick={() => setActiveTab('startup')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'startup'
                  ? 'bg-coral text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Startup</span>
            </button>
            
            <button
              onClick={() => setActiveTab('investor')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'investor'
                  ? 'bg-coral text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Investisseur</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-coral text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Général</span>
            </button>
          </div>
        </div>

        {/* Suggested Questions Carousel */}
        <div className="overflow-x-auto border-b border-sand px-3 py-2 bg-sand/10">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted flex items-center gap-1 font-semibold flex-shrink-0 text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-coral" />
              Suggestions :
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {currentQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectSuggestedQuestion(q)}
                  disabled={isLoading}
                  className="whitespace-nowrap rounded-md border border-sand bg-surface px-2.5 py-1 text-[0.6875rem] text-ink transition hover:border-coral/40 hover:bg-coral/10 hover:text-coral disabled:opacity-50 cursor-pointer"
                >
                  {q.question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-3.5">
          {/* Empty State Banner if messages empty */}
          {currentMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className="size-12 rounded-2xl bg-coral/10 text-coral flex items-center justify-center mb-3">
                <MessageSquare className="size-6" />
              </div>
              <h4 className="text-sm font-semibold text-ink">Aucun message pour le moment</h4>
              <p className="text-xs text-taupe mt-1 max-w-xs">
                Posez une question sur le cadre légal ou cliquez sur l'une des suggestions ci-dessus.
              </p>
            </div>
          )}

          {currentMessages.map((msg) => {
            const isAi = msg.sender === 'ai';
            const hasSources = isAi && msg.sources && msg.sources.length > 0;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    isAi
                      ? 'bg-coral text-white'
                      : 'bg-sand text-ink'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="max-w-[88%] sm:max-w-[84%] space-y-1.5">
                  {isAi && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-coral">
                        {msg.title || 'Assistant StartupY'}
                      </span>
                      <span className="text-[10px] text-muted ml-auto">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  <div
                    className={`rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? msg.isError 
                          ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                          : 'bg-surface text-ink border border-sand shadow-sm'
                        : 'bg-coral text-white font-medium ml-auto shadow-md'
                    }`}
                  >
                    {isAi ? (
                      <div className="space-y-3">
                        {/* Answer Text */}
                        <div className="whitespace-pre-line text-ink leading-relaxed">
                          {msg.content}
                        </div>

                        {/* Verified Sources Consulted Section */}
                        {hasSources && (
                          <div className="pt-3 border-t border-sand space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink uppercase tracking-wider">
                              <BookOpen className="w-3.5 h-3.5 text-coral" />
                              <span>Sources vérifiées ({msg.sources.length}) :</span>
                            </div>

                            <div className="space-y-1.5">
                              {msg.sources.map((src, idx) => (
                                <div 
                                  key={idx} 
                                  className="p-2.5 rounded-lg bg-surface-elevated border border-sand/70 text-xs flex flex-col gap-1 transition-colors hover:border-coral/40"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="font-semibold text-ink line-clamp-1">
                                      {src.title}
                                    </span>
                                    {src.url ? (
                                      <a 
                                        href={src.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-coral hover:text-coral-dark inline-flex items-center gap-1 text-[11px] font-medium flex-shrink-0"
                                      >
                                        <span>Consulter</span>
                                        <ExternalLink className="size-3" />
                                      </a>
                                    ) : null}
                                  </div>
                                  <div className="text-[10px] text-taupe flex items-center justify-between">
                                    <span>{src.publisher || src.source}</span>
                                    {src.score ? (
                                      <span className="text-taupe font-medium">{Math.round(src.score * 100)}% pertinence</span>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Copy Action Strip */}
                        <div className="pt-2 border-t border-sand/50 flex items-center justify-between text-xs text-muted">
                          <span className="text-[10px] text-taupe italic">
                            Réponses vérifiées · Startup Act Tunisie
                          </span>
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="flex items-center gap-1 text-taupe hover:text-ink transition-colors cursor-pointer text-xs"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600 font-medium">Copié</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copier</span>
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

          {/* Loading State Spinner */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-coral text-white flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-surface rounded-xl p-3.5 border border-sand text-ink text-xs sm:text-sm flex items-center gap-2.5 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-coral flex-shrink-0" />
                <span>Recherche dans la base de connaissances & synthèse en cours...</span>
              </div>
            </div>
          )}

          {/* Error Banner with Retry */}
          {errorMessage && !isLoading && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 flex-shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={handleRetryLastQuery}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-coral text-white font-medium cursor-pointer hover:bg-coral-dark text-xs flex-shrink-0"
              >
                <RotateCcw className="size-3" />
                <span>Réessayer</span>
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-sand p-3 bg-surface">
          <form onSubmit={handleSendCustomQuery} className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              placeholder={
                activeTab === 'startup'
                  ? 'Posez votre question (ex: Bourse Startup Act, SARL, compte devises...)'
                  : (activeTab === 'investor' 
                      ? 'Diligence investisseur (ex: dégrèvement fiscal, ANAVA, SAFE en TND...)'
                      : 'Recherche générale dans la base de connaissances...')
              }
              className="min-w-0 flex-1 rounded-xl border border-sand bg-surface-elevated px-3.5 py-2.5 text-xs sm:text-sm text-ink outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="flex items-center gap-1.5 rounded-xl bg-coral px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-coral-dark disabled:opacity-50 cursor-pointer flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Envoyer</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
          <p className="mt-2 px-1 text-[0.625rem] text-taupe leading-tight">
            Les réponses proviennent de la documentation officielle de l'écosystème startup en Tunisie et sont fournies à titre indicatif.
          </p>
        </div>
      </div>
    </div>
  );
}
