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
  Copy
} from 'lucide-react';
import { AI_SUGGESTED_QUESTIONS, generateCustomAiResponse } from '../data/aiResponses';

export default function AiGuideModal({ 
  isOpen, 
  onClose, 
  initialRole = 'startup' 
}) {
  const [activeTab, setActiveTab] = useState(initialRole);
  const [inputQuery, setInputQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  
  // Separate message histories for startup & investor
  const [messages, setMessages] = useState({
    startup: [
      {
        id: 'welcome-startup',
        sender: 'ai',
        title: 'Startup AI Guidance Engine',
        content: `Welcome to the **StartupBridge Founder AI Guide**. 

I specialize in pitch deck structure, valuation benchmarking, investor due diligence readiness, and fundraising storytelling. 

Select one of the suggested prompts below or ask any question to evaluate your startup strategy!`,
        isDemo: true,
        timestamp: 'Just now'
      }
    ],
    investor: [
      {
        id: 'welcome-investor',
        sender: 'ai',
        title: 'Investor AI Deal Flow Advisory',
        content: `Welcome to the **StartupBridge Investor AI Guide**. 

I assist venture funds and angel syndicates with deal qualification, traction validation, dilution scenarios, and founder risk assessments. 

Choose a question below or enter a custom diligence query to explore demo insights!`,
        isDemo: true,
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
  }, [messages, activeTab, isOpen]);

  if (!isOpen) return null;

  const currentQuestions = AI_SUGGESTED_QUESTIONS[activeTab] || [];
  const currentMessages = messages[activeTab] || [];

  const handleSelectSuggestedQuestion = (item) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: item.question,
      timestamp: 'Just now'
    };

    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      title: item.question,
      content: item.answer,
      isDemo: true,
      timestamp: 'Just now'
    };

    setMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMsg, aiMsg]
    }));
  };

  const handleSendCustomQuery = (e) => {
    e?.preventDefault();
    const query = inputQuery.trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: 'Just now'
    };

    const generated = generateCustomAiResponse(activeTab, query);

    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      title: generated.title,
      content: generated.body,
      isDemo: true,
      timestamp: 'Just now'
    };

    setMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMsg, aiMsg]
    }));

    setInputQuery('');
  };

  const handleResetChat = () => {
    setMessages(prev => ({
      ...prev,
      [activeTab]: [
        {
          id: `welcome-${activeTab}-${Date.now()}`,
          sender: 'ai',
          title: activeTab === 'startup' ? 'Startup AI Guidance Engine' : 'Investor AI Deal Flow Advisory',
          content: activeTab === 'startup'
            ? 'Conversation reset. What founder or fundraising question would you like to explore next?'
            : 'Conversation reset. What investment diligence or market question can I assist you with?',
          isDemo: true,
          timestamp: 'Just now'
        }
      ]
    }));
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
                  StartupBridge AI Guide
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-violet-950 text-violet-300 border border-violet-700/50">
                  Demo AI Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive strategic guidance for founders and investment decision-makers.
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
              <span>Startup Guide</span>
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
              <span>Investor Guide</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Predefined demo answers</span>
          </div>
        </div>

        {/* Suggested Questions Pill Carousel */}
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
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700/80 hover:text-white border border-slate-700/60 hover:border-blue-500/50 transition-all cursor-pointer flex-shrink-0"
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
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5`}>
                  
                  {isAi && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-violet-400">
                        StartupBridge AI
                      </span>
                      {msg.isDemo && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/60">
                          Demo AI response
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
                      <div className="space-y-3">
                        <div className="whitespace-pre-line text-slate-200 text-sm leading-relaxed">
                          {msg.content}
                        </div>
                        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                          <span className="text-[11px] italic text-slate-400">
                            Educational demo model for review.
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
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 sm:p-5 bg-[#0C1322] border-t border-slate-800">
          <form onSubmit={handleSendCustomQuery} className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                activeTab === 'startup'
                  ? 'Ask about valuation, pitch deck structure, SAFE terms, traction...'
                  : 'Ask about founder evaluation, dilution math, cap tables, red flags...'
              }
              className="flex-1 bg-slate-800/90 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-violet-600/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Ask AI</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
            <span>Click any suggested pill above or type any query to get instantaneous advice.</span>
            <span className="hidden sm:inline">No real external API keys required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
