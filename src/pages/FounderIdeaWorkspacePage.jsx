import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Users, 
  Target, 
  MessageSquare, 
  Rocket, 
  Coins,
  Brain,
  ChevronRight,
  Loader2,
  Shield,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveCurrentStartup } from '../utils/storage';
import { getDefaultPublicationState, savePublicationState } from '../utils/publicationStatus';

// Diagnostic questions the AI guides the founder through
const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'problem',
    question: 'What problem are you solving?',
    placeholder: 'Describe the problem you\'ve identified. What pain point or inefficiency exists in the Tunisian market?',
    icon: Target,
    hint: 'Be specific about who experiences this problem and how it affects them.',
  },
  {
    id: 'audience',
    question: 'Who experiences this problem?',
    placeholder: 'Describe your target customer or user segment. Where in Tunisia are they located?',
    icon: Users,
    hint: 'Think about demographics, behaviors, and location (governorate, urban/rural).',
  },
  {
    id: 'solution',
    question: 'What is your proposed solution?',
    placeholder: 'How does your product or service address this problem? What makes it different?',
    icon: Lightbulb,
    hint: 'Focus on the core value proposition. What will users experience differently?',
  },
  {
    id: 'validation',
    question: 'Have you spoken to potential users?',
    placeholder: 'Have you conducted interviews, surveys, or tests with real users? Share what you learned.',
    icon: MessageSquare,
    hint: 'Even informal conversations count. Honest assessment helps us guide you better.',
  },
  {
    id: 'prototype',
    question: 'Do you have a prototype or MVP?',
    placeholder: 'Describe the current state of your product: idea only, wireframes, prototype, MVP, live product...',
    icon: Rocket,
    hint: 'There\'s no wrong answer. We support founders at every stage.',
  },
  {
    id: 'funding',
    question: 'Are you looking for funding now?',
    placeholder: 'Tell us about your funding needs: not yet, exploring grants, seeking angel/seed investment, etc.',
    icon: Coins,
    hint: 'Be honest about timing. Premature fundraising can hurt more than help.',
  },
];

// Generate readiness score from answers
function calculateReadinessScore(answers) {
  let score = 0;
  let maxScore = 100;

  // Problem clarity (20 pts)
  if (answers.problem && answers.problem.length > 30) score += 20;
  else if (answers.problem && answers.problem.length > 10) score += 10;

  // Customer understanding (20 pts)
  if (answers.audience && answers.audience.length > 30) score += 20;
  else if (answers.audience && answers.audience.length > 10) score += 10;

  // Solution articulation (20 pts)
  if (answers.solution && answers.solution.length > 30) score += 20;
  else if (answers.solution && answers.solution.length > 10) score += 10;

  // Validation effort (15 pts)
  const valLower = (answers.validation || '').toLowerCase();
  if (valLower.includes('interview') || valLower.includes('survey') || valLower.includes('test') || valLower.includes('spoke') || valLower.includes('talked')) {
    score += 15;
  } else if (answers.validation && answers.validation.length > 10) {
    score += 7;
  }

  // Prototype stage (15 pts)
  const protoLower = (answers.prototype || '').toLowerCase();
  if (protoLower.includes('live') || protoLower.includes('launched') || protoLower.includes('revenue')) {
    score += 15;
  } else if (protoLower.includes('mvp') || protoLower.includes('prototype') || protoLower.includes('beta')) {
    score += 12;
  } else if (protoLower.includes('wireframe') || protoLower.includes('design') || protoLower.includes('mockup')) {
    score += 8;
  } else if (answers.prototype && answers.prototype.length > 5) {
    score += 4;
  }

  // Funding awareness (10 pts)
  if (answers.funding && answers.funding.length > 10) score += 10;
  else if (answers.funding && answers.funding.length > 3) score += 5;

  return { score, maxScore, percentage: Math.round((score / maxScore) * 100) };
}

// Generate personalized roadmap recommendations
function generateRoadmapRecommendations(answers) {
  const recommendations = [];
  const valLower = (answers.validation || '').toLowerCase();
  const protoLower = (answers.prototype || '').toLowerCase();

  if (!answers.problem || answers.problem.length < 30) {
    recommendations.push({
      priority: 'high',
      title: 'Sharpen Your Problem Statement',
      description: 'A clear, specific problem statement is the foundation of every successful startup. Dedicate time to articulating exactly what pain point you\'re solving.',
      roadmapStep: 2,
    });
  }

  if (!answers.audience || answers.audience.length < 30) {
    recommendations.push({
      priority: 'high',
      title: 'Define Your Target Customer',
      description: 'Identify your ideal customer profile in the Tunisian market. Consider demographics, location, and willingness to pay.',
      roadmapStep: 2,
    });
  }

  if (!valLower.includes('interview') && !valLower.includes('survey') && !valLower.includes('test')) {
    recommendations.push({
      priority: 'high',
      title: 'Start Customer Discovery',
      description: 'Talk to at least 15 potential customers in Tunisia. Ask about their current workarounds and budget for solving this problem.',
      roadmapStep: 3,
    });
  }

  if (!protoLower.includes('mvp') && !protoLower.includes('prototype') && !protoLower.includes('live') && !protoLower.includes('launched')) {
    recommendations.push({
      priority: 'medium',
      title: 'Build a Minimum Viable Product',
      description: 'Create the simplest version of your solution that demonstrates your core value proposition. This doesn\'t need to be perfect.',
      roadmapStep: 4,
    });
  }

  recommendations.push({
    priority: 'medium',
    title: 'Complete Founder Diagnostic',
    description: 'Assess your founding team\'s skills, commitment, and equity structure using the Bidaya roadmap.',
    roadmapStep: 1,
  });

  recommendations.push({
    priority: 'low',
    title: 'Explore Tunisian Funding Options',
    description: 'Learn about grants (BFPME, APIA), angel investors, and the Startup Act label. Use the Tunisia AI Guide for personalized advice.',
    roadmapStep: 8,
  });

  return recommendations;
}

const WORKSPACE_STORAGE_KEY = 'bidaya_founder_idea_workspace';

export default function FounderIdeaWorkspacePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const chatEndRef = useRef(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [readinessResult, setReadinessResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Load saved workspace on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.currentStep !== undefined) setCurrentStep(parsed.currentStep);
        if (parsed.conversationHistory) setConversationHistory(parsed.conversationHistory);
        if (parsed.completed) {
          setCompleted(true);
          setReadinessResult(parsed.readinessResult);
          setRecommendations(parsed.recommendations || []);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Save workspace state
  const saveWorkspace = (updates = {}) => {
    try {
      const state = {
        answers: updates.answers || answers,
        currentStep: updates.currentStep !== undefined ? updates.currentStep : currentStep,
        conversationHistory: updates.conversationHistory || conversationHistory,
        completed: updates.completed || completed,
        readinessResult: updates.readinessResult || readinessResult,
        recommendations: updates.recommendations || recommendations,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, isTyping]);

  // Add initial AI message on first load
  useEffect(() => {
    if (conversationHistory.length === 0 && currentStep === 0) {
      const initialMessages = [
        {
          type: 'ai',
          text: `Welcome to your private workspace, ${profile?.full_name?.split(' ')[0] || 'Founder'}! 🇹🇳`,
          timestamp: Date.now(),
        },
        {
          type: 'ai',
          text: 'Everything you share here stays completely private. No investor, no other user — only you can see this workspace. Your startup defaults to Draft status.',
          timestamp: Date.now() + 100,
        },
        {
          type: 'ai',
          text: `Let's explore your idea together. I'll ask you ${DIAGNOSTIC_QUESTIONS.length} questions to understand where you are and build your personalized roadmap.`,
          timestamp: Date.now() + 200,
        },
        {
          type: 'question',
          questionIndex: 0,
          text: DIAGNOSTIC_QUESTIONS[0].question,
          timestamp: Date.now() + 300,
        },
      ];
      setConversationHistory(initialMessages);
      saveWorkspace({ conversationHistory: initialMessages });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmitAnswer = () => {
    if (!currentInput.trim()) return;

    const question = DIAGNOSTIC_QUESTIONS[currentStep];
    const answer = currentInput.trim();

    // Add user answer to conversation
    const newHistory = [
      ...conversationHistory,
      { type: 'user', text: answer, questionId: question.id, timestamp: Date.now() },
    ];

    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);
    setCurrentInput('');
    setConversationHistory(newHistory);
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const nextStep = currentStep + 1;
      let updatedHistory = [...newHistory];

      // Add acknowledgment
      const ackMessages = getAcknowledgment(question.id, answer);
      updatedHistory.push({
        type: 'ai',
        text: ackMessages,
        timestamp: Date.now(),
      });

      if (nextStep < DIAGNOSTIC_QUESTIONS.length) {
        // Ask next question
        updatedHistory.push({
          type: 'question',
          questionIndex: nextStep,
          text: DIAGNOSTIC_QUESTIONS[nextStep].question,
          timestamp: Date.now() + 100,
        });
        setCurrentStep(nextStep);
        setConversationHistory(updatedHistory);
        setIsTyping(false);
        saveWorkspace({
          answers: newAnswers,
          currentStep: nextStep,
          conversationHistory: updatedHistory,
        });
      } else {
        // All questions answered — generate results
        const result = calculateReadinessScore(newAnswers);
        const recs = generateRoadmapRecommendations(newAnswers);

        updatedHistory.push({
          type: 'ai',
          text: `Excellent! I've analyzed your responses and generated your Startup Readiness Score: **${result.percentage}%**`,
          timestamp: Date.now() + 100,
        });
        updatedHistory.push({
          type: 'results',
          readinessResult: result,
          recommendations: recs,
          timestamp: Date.now() + 200,
        });

        setConversationHistory(updatedHistory);
        setCompleted(true);
        setReadinessResult(result);
        setRecommendations(recs);
        setIsTyping(false);

        // Create a draft startup profile from workspace answers
        const startupProfile = createDraftStartup(newAnswers, result);
        saveCurrentStartup(startupProfile);
        savePublicationState(startupProfile.id, getDefaultPublicationState());

        saveWorkspace({
          answers: newAnswers,
          currentStep: nextStep,
          conversationHistory: updatedHistory,
          completed: true,
          readinessResult: result,
          recommendations: recs,
        });
      }
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard/startup');
  };

  const getReadinessColor = (pct) => {
    if (pct >= 70) return 'text-emerald-400';
    if (pct >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'border-rose-500/40 bg-rose-500/10';
    if (priority === 'medium') return 'border-amber-500/40 bg-amber-500/10';
    return 'border-blue-500/40 bg-blue-500/10';
  };

  const getPriorityLabel = (priority) => {
    if (priority === 'high') return 'High Priority';
    if (priority === 'medium') return 'Next Step';
    return 'Recommended';
  };

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Privacy Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Private Founder Workspace
          </p>
          <p className="text-xs text-slate-400">
            Everything here is visible only to you. Your startup is in <span className="text-slate-300 font-semibold">Draft</span> status — invisible to all investors, other users and search.
          </p>
        </div>
      </div>

      {/* Workspace Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-800/60 text-xs font-semibold text-violet-300 mb-3">
          <Brain className="w-3.5 h-3.5" />
          <span>AI-Guided Idea Diagnostic</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tell us about your startup idea
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl">
          Even if it's not fully formed yet. Our AI guide will help you structure your thinking and create a personalized roadmap for the Tunisian ecosystem.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Question {Math.min(currentStep + 1, DIAGNOSTIC_QUESTIONS.length)} of {DIAGNOSTIC_QUESTIONS.length}</span>
          <span>{completed ? '✅ Complete' : `${Math.round((currentStep / DIAGNOSTIC_QUESTIONS.length) * 100)}%`}</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${completed ? 100 : (currentStep / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Chat Conversation */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        
        {/* Chat Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {conversationHistory.map((msg, idx) => {
            if (msg.type === 'ai') {
              return (
                <div key={idx} className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800/80 rounded-2xl rounded-tl-md p-4 max-w-[85%] border border-slate-700/50">
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            }
            
            if (msg.type === 'question') {
              const q = DIAGNOSTIC_QUESTIONS[msg.questionIndex];
              const QIcon = q.icon;
              return (
                <div key={idx} className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-blue-950/80 to-violet-950/80 rounded-2xl rounded-tl-md p-4 max-w-[85%] border border-blue-500/30 shadow-lg shadow-blue-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <QIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                        Question {msg.questionIndex + 1}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">{q.question}</p>
                    <p className="text-xs text-slate-400 mt-1.5">{q.hint}</p>
                  </div>
                </div>
              );
            }
            
            if (msg.type === 'user') {
              return (
                <div key={idx} className="flex gap-3 justify-end">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl rounded-tr-md p-4 max-w-[85%] shadow-lg shadow-blue-500/20">
                    <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
                    {profile?.full_name?.charAt(0) || 'F'}
                  </div>
                </div>
              );
            }

            if (msg.type === 'results') {
              const result = msg.readinessResult;
              const recs = msg.recommendations;
              return (
                <div key={idx} className="space-y-4">
                  {/* Readiness Score Card */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 bg-slate-800/80 rounded-2xl rounded-tl-md p-5 border border-slate-700/50 space-y-4">
                      <div className="text-center">
                        <p className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-2">
                          Initial Readiness Score
                        </p>
                        <div className={`text-5xl font-black ${getReadinessColor(result.percentage)}`}>
                          {result.percentage}%
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {result.score} / {result.maxScore} points
                        </p>
                        <p className="text-xs text-slate-300 mt-3 max-w-md mx-auto leading-relaxed">
                          {result.percentage >= 70
                            ? 'Strong foundation! You\'re well positioned to move forward quickly.'
                            : result.percentage >= 40
                            ? 'Good starting point. Focus on the high-priority items below to strengthen your position.'
                            : 'You\'re at the beginning of your journey. That\'s perfectly fine — follow the roadmap below to build momentum.'
                          }
                        </p>
                      </div>

                      {/* Recommendations */}
                      <div className="space-y-2 pt-3 border-t border-slate-700/50">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">
                          Your Personalized Roadmap:
                        </p>
                        {recs.map((rec, i) => (
                          <div key={i} className={`p-3 rounded-xl border ${getPriorityColor(rec.priority)}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                rec.priority === 'high' ? 'text-rose-400' : rec.priority === 'medium' ? 'text-amber-400' : 'text-blue-400'
                              }`}>
                                {getPriorityLabel(rec.priority)}
                              </span>
                              <span className="text-[10px] text-slate-500">Step {rec.roadmapStep}</span>
                            </div>
                            <p className="text-xs font-semibold text-white">{rec.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{rec.description}</p>
                          </div>
                        ))}
                      </div>

                      {/* Privacy reminder */}
                      <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-2">
                        <Lock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>
                          Your startup remains completely private in <strong>Draft</strong> status. When you're ready, you can request investor visibility from your dashboard — but only after completing key roadmap items.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800/80 rounded-2xl rounded-tl-md p-4 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                  <span className="text-xs text-slate-400">Analyzing your response...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        {!completed ? (
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80">
            <div className="flex gap-3">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={DIAGNOSTIC_QUESTIONS[currentStep]?.placeholder || 'Type your answer...'}
                rows={3}
                disabled={isTyping}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none disabled:opacity-50"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentInput.trim() || isTyping}
                className={`self-end px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  currentInput.trim() && !isTyping
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80">
            <button
              onClick={handleGoToDashboard}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Go to Your Startup Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-slate-500 mt-2">
              Your answers are saved. You can continue building from your dashboard.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

/**
 * Generate contextual acknowledgment based on the answer
 */
function getAcknowledgment(questionId, answer) {
  const short = answer.length < 20;

  switch (questionId) {
    case 'problem':
      return short
        ? 'Good start. You can always refine your problem statement later as you learn more from customers.'
        : 'Great articulation of the problem. Understanding the pain point deeply is the most critical step for any startup.';
    case 'audience':
      return short
        ? 'You can develop a more detailed customer profile as you progress. Let\'s continue.'
        : 'Clear target audience definition. Knowing exactly who you serve will guide every decision you make.';
    case 'solution':
      return short
        ? 'A focused solution is good. You\'ll refine it through customer feedback and iteration.'
        : 'Strong solution description. The key will be validating that customers value this enough to pay or engage.';
    case 'validation':
      return answer.toLowerCase().includes('yes') || answer.toLowerCase().includes('interview')
        ? 'Excellent — talking to real users is the single most important thing a founder can do at the early stage.'
        : 'No worries. Customer discovery is your next key milestone. The Tunisian ecosystem is accessible — start with informal conversations.';
    case 'prototype':
      return answer.toLowerCase().includes('mvp') || answer.toLowerCase().includes('live')
        ? 'Having a working product is a significant advantage. This will help tremendously with validation and fundraising.'
        : 'You\'re at a perfect stage to use the Bidaya roadmap. We\'ll guide you step by step.';
    case 'funding':
      return 'Understood. Your funding strategy should align with your stage and traction. We\'ll help you identify the right timing and sources in Tunisia.';
    default:
      return 'Thank you for sharing. Let\'s continue.';
  }
}

/**
 * Create a minimal draft startup profile from workspace answers
 */
function createDraftStartup(answers, readinessResult) {
  const id = `draft-${Date.now().toString().slice(-6)}`;
  return {
    id,
    name: 'My Startup (Draft)',
    pitch: answers.solution || answers.problem || 'Work in progress',
    sector: 'Not Set',
    stage: 'Idea',
    fundingNeeded: 'Not Set',
    governorate: 'Not Set',
    country: 'Tunisia',
    legalStatus: 'Idea',
    registeredInTunisia: 'Not yet',
    fundingTypeSought: answers.funding || 'Exploring',
    problem: answers.problem || '',
    solution: answers.solution || '',
    targetAudience: answers.audience || '',
    validation: answers.validation || '',
    prototypeStatus: answers.prototype || '',
    readinessScore: readinessResult.percentage,
    publication_status: 'draft',
    created_at: new Date().toISOString(),
    traction: [],
    highlights: ['Draft', 'Idea Stage'],
    team: [],
    financials: { mrr: 'N/A', burnRate: 'N/A', runway: 'N/A', grossMargin: 'N/A' },
    useOfFunds: {},
  };
}
