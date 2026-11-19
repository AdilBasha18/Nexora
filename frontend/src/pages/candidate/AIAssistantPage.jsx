import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PromptInputBox } from '../../components/ui/ai-prompt-box';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  BookOpen, 
  AlertCircle, 
  User, 
  RefreshCw,
  Plus,
  MessageSquare,
  Copy,
  Check,
  RotateCcw,
  CheckCircle2,
  Terminal,
  PanelLeftClose,
  PanelLeftOpen,
  Edit2,
  X,
  Briefcase,
  Code2,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';

// Formatted Code Block component with syntax styling and Copy button
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 text-xs shadow-md">
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-800/90 border-b border-slate-700/80 text-[11px] text-slate-300">
        <span className="font-mono uppercase font-bold flex items-center text-blue-400">
          <Terminal className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold transition"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-[12px] leading-relaxed text-blue-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Markdown Formatter for Assistant responses
function FormattedMessage({ content }) {
  if (!content) return null;

  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-800">
      {parts.map((part, pIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          let language = 'text';
          let code = part.slice(3, -3);

          if (lines.length > 0 && /^[a-zA-Z0-9_-]+$/.test(lines[0].trim())) {
            language = lines[0].trim();
            code = lines.slice(1).join('\n');
          }

          return <CodeBlock key={pIdx} code={code.trim()} language={language} />;
        }

        const lines = part.split('\n');
        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1.5" />;

              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="font-bold text-slate-900 text-xs sm:text-sm pt-2">
                    {trimmed.replace(/^###\s+/, '')}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="font-extrabold text-slate-900 text-sm sm:text-base pt-2.5 border-b border-slate-200 pb-1">
                    {trimmed.replace(/^##\s+/, '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2 key={lIdx} className="font-black text-slate-900 text-base sm:text-lg pt-3">
                    {trimmed.replace(/^#\s+/, '')}
                  </h2>
                );
              }

              // Bullet points
              if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const bulletText = trimmed.replace(/^[•*-]\s+/, '');
                return (
                  <div key={lIdx} className="flex items-start space-x-2 pl-2">
                    <span className="text-blue-500 font-bold shrink-0">•</span>
                    <span dangerouslySetInnerHTML={{ __html: formatInline(bulletText) }} />
                  </div>
                );
              }

              // Numbered lists
              if (/^\d+\.\s+/.test(trimmed)) {
                return (
                  <div key={lIdx} className="flex items-start space-x-2 pl-2">
                    <span className="text-blue-600 font-bold font-mono text-[11px] shrink-0">
                      {trimmed.match(/^\d+\./)[0]}
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/^\d+\.\s+/, '')) }} />
                  </div>
                );
              }

              return (
                <p key={lIdx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function formatInline(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200/80 font-mono text-[11px] text-blue-700 font-semibold">$1</code>');
}

export default function AIAssistantPage({ role: propRole }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = propRole || user?.role || 'CANDIDATE';
  const isRecruiter = userRole === 'RECRUITER';

  // Chat State
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [copiedMsgIdx, setCopiedMsgIdx] = useState(null);

  // Conversations & History Sidebar State
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingConvId, setEditingConvId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const hasLoadedInitial = useRef(false);

  // Role-Specific Prompt Suggestions (CHUNK 2 & CHUNK 3)
  const candidatePrompts = [
    { title: "Optimize Resume for ATS", prompt: "How can I optimize my technical resume for modern ATS parsers without stuffing fake keywords?" },
    { title: "STAR Method Interview Prep", prompt: "Explain the STAR method with an example for an engineering behavioral interview." },
    { title: "Python Algorithm Practice", prompt: "Explain how to solve the Two Sum problem in Python with O(n) time complexity." },
    { title: "Job Readiness Index", prompt: "How does Nexora calculate my Job Readiness Score and how can I improve my demonstrated skills?" },
    { title: "Full Stack Roadmap", prompt: "What are the core technologies and architecture principles needed for a Full Stack Developer in 2026?" },
    { title: "Skill Assessments Guide", prompt: "How do Nexora's 16 skill assessments and coding challenges work?" }
  ];

  const recruiterPrompts = [
    { title: "Draft Job Description", prompt: "Draft a comprehensive Job Description for a Senior React & Node.js Full Stack Engineer." },
    { title: "Technical Interview Rubric", prompt: "What technical screening questions should I ask to evaluate a candidate's system design and Python skills?" },
    { title: "Candidate Assessment Scores", prompt: "How does Nexora evaluate and verify candidate skill assessments and coding sandbox results?" },
    { title: "Screening Criteria", prompt: "What are key benchmark skills and qualifications to look for when hiring a junior Data Analyst?" },
    { title: "Interview Invitation Email", prompt: "Draft a professional, welcoming interview invitation email for a shortlisted software engineering candidate." },
    { title: "Hiring Workflow on Nexora", prompt: "Explain how candidate application stages (Submitted, Review, Shortlisted, Interview) work on Nexora." }
  ];

  const suggestedPrompts = isRecruiter ? recruiterPrompts : candidatePrompts;

  useEffect(() => {
    loadConversations();
    // Default to New Chat on first load (CHUNK 1: Do not auto-load previous conversation)
    handleStartNewChat();
  }, [userRole]);

  // Handle continuation from Resume Checker or external links
  useEffect(() => {
    if (hasLoadedInitial.current) return;
    if (location.state?.initialPrompt) {
      hasLoadedInitial.current = true;
      const initialText = location.state.initialPrompt;
      const contextText = location.state.context || '';
      
      const fullQuery = contextText 
        ? `${initialText}\n\n[Context from Nexora Studio]:\n${contextText}` 
        : initialText;

      handleSendMessage(fullQuery);
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function loadConversations() {
    try {
      const data = await api.getConversations();
      const list = data.results || data || [];
      setConversations(list);
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
  }

  // Load an existing conversation from history
  async function selectConversation(convId) {
    setActiveConvId(convId);
    setHasError(false);
    setLoading(true);
    try {
      const data = await api.getConversationDetail(convId);
      setMessages(data.messages || []);
    } catch (e) {
      console.error("Error loading conversation:", e);
    } finally {
      setLoading(false);
    }
  }

  // Start fresh conversation (New Chat by default - CHUNK 1)
  const handleStartNewChat = () => {
    setActiveConvId(null);
    setHasError(false);
    setLastFailedQuery('');
    setMessages([]);
  };

  // Delete individual conversation
  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await api.deleteConversation(convId);
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (activeConvId === convId) {
        handleStartNewChat();
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  // Rename conversation
  const handleSaveRename = async (e, convId) => {
    e.stopPropagation();
    if (!editingTitle.trim()) {
      setEditingConvId(null);
      return;
    }
    try {
      const updated = await api.renameConversation(convId, editingTitle.trim());
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: updated.title } : c));
      setEditingConvId(null);
    } catch (err) {
      console.error("Failed to rename conversation:", err);
      setEditingConvId(null);
    }
  };

  // Clear all conversations with confirmation
  const handleClearAllHistory = async () => {
    try {
      await api.clearConversations();
      setConversations([]);
      handleStartNewChat();
      setShowClearModal(false);
    } catch (err) {
      console.error("Failed to clear conversations:", err);
      setShowClearModal(false);
    }
  };

  // Send message
  const handleSendMessage = async (queryText, files) => {
    let textToSend = (queryText || inputQuery).trim();
    if (!textToSend && (!files || files.length === 0)) return;
    if (loading) return;

    if (files && files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ');
      textToSend = textToSend ? `${textToSend}\n\n[Attachment: ${fileNames}]` : `[Attached image: ${fileNames}]`;
    }

    setInputQuery('');
    setHasError(false);
    setLastFailedQuery('');

    // Append user message immediately
    const userMsg = {
      sender: 'USER',
      message: textToSend,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const payload = {
        message: textToSend,
        conversation_id: activeConvId
      };

      const response = await api.askAssistant(payload);

      // If this was a new conversation, record its ID and refresh history
      if (!activeConvId && response.conversation_id) {
        setActiveConvId(response.conversation_id);
        loadConversations();
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ASSISTANT',
          message: response.message?.message || response.answer || "I have received your request.",
          retrieved_sources: response.sources || [],
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setHasError(true);
      setLastFailedQuery(textToSend);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ASSISTANT',
          isError: true,
          message: "I encountered a communication issue while processing your request. Please click 'Retry' to resend.",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  // Copy message text
  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgIdx(idx);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  // Handle Enter to send (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const candidateFirstName = user?.full_name ? user.full_name.split(' ')[0] : 'there';

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 flex overflow-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HIDEABLE CHAT HISTORY SIDEBAR (CHUNK 1) */}
      {/* ========================================================================= */}
      <aside className={`
        ${sidebarOpen ? 'w-72 sm:w-80' : 'w-0'} 
        transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden relative z-20 shadow-xs
      `}>
        {sidebarOpen && (
          <div className="flex flex-col h-full w-72 sm:w-80">
            
            {/* Sidebar Top: New Chat & Toggle */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <button
                type="button"
                onClick={handleStartNewChat}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1.5 mr-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation History List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Saved Conversations
              </span>

              {conversations.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 px-4">
                  No prior chats yet. Start a new conversation to build your history.
                </div>
              ) : (
                conversations.map((c) => {
                  const isActive = activeConvId === c.id;
                  const isEditing = editingConvId === c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => !isEditing && selectConversation(c.id)}
                      className={`group relative p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                        isActive
                          ? 'bg-blue-50/80 border-blue-200 text-blue-900 font-semibold'
                          : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate mr-2">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(e, c.id)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            className="text-xs px-1.5 py-0.5 border border-blue-400 rounded bg-white text-slate-900 outline-none w-36"
                          />
                        ) : (
                          <span className="truncate">{c.title || 'Conversation'}</span>
                        )}
                      </div>

                      {/* Conversation Action Buttons */}
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={(e) => handleSaveRename(e, c.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-700"
                            title="Save title"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingConvId(c.id);
                              setEditingTitle(c.title || '');
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="Rename chat"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteConversation(e, c.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Footer: Clear History */}
            {conversations.length > 0 && (
              <div className="p-3 border-t border-slate-200 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setShowClearModal(true)}
                  className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 text-[11px] font-semibold transition flex items-center justify-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All History</span>
                </button>
              </div>
            )}

          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CHAT WORKSPACE (CHUNK 1 & CHUNK 2) */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[radial-gradient(125%_125%_at_50%_101%,rgba(245,87,2,0.85)_10.5%,rgba(245,120,2,0.7)_16%,rgba(245,140,2,0.6)_17.5%,rgba(245,170,100,0.6)_25%,rgba(238,174,202,0.7)_40%,rgba(202,179,214,0.8)_65%,rgba(148,201,233,0.9)_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_101%,rgba(215,70,5,0.45)_10%,rgba(180,80,20,0.4)_16%,rgba(180,90,140,0.35)_40%,rgba(90,80,160,0.4)_65%,rgba(15,23,42,0.95)_100%)]">
        
        {/* Workspace Top Bar */}
        <header className="h-14 bg-white/70 dark:bg-[#0b101d]/70 backdrop-blur-md border-b border-white/20 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
          <div className="flex items-center space-x-3">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title="Expand chat history"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                  {isRecruiter ? 'Nexora AI Recruitment Advisor' : 'Nexora AI Career Assistant'}
                </h1>
                <p className="text-[10px] text-slate-400">
                  {isRecruiter ? 'Hiring Strategy • Job Requisitions • Candidate Evaluation' : 'Technical Guidance • Resume ATS • Interview Preparation'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleStartNewChat}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </header>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* WELCOME SCREEN (When conversation is fresh / empty) */}
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto my-auto py-8 px-6 space-y-6 text-center animate-in fade-in bg-white/75 dark:bg-[#0f172a]/75 backdrop-blur-md rounded-3xl border border-white/50 dark:border-white/10 shadow-lg">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isRecruiter ? `Welcome, ${candidateFirstName}!` : `Hello, ${candidateFirstName}!`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                  {isRecruiter
                    ? 'I am your intelligent recruitment partner. Ask me to draft job descriptions, design technical interview questions, or explain candidate readiness metrics.'
                    : 'I can assist you with full-stack coding, interview prep, honest ATS resume feedback, or navigating your Career GPS.'}
                </p>
              </div>

              {/* Suggested Questions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-2">
                {suggestedPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xs hover:border-blue-400 hover:bg-white dark:hover:bg-[#1e293b] text-xs text-slate-800 dark:text-slate-100 transition shadow-xs group flex items-start justify-between space-x-2"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 block group-hover:text-blue-700 transition">
                        {item.title}
                      </span>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 mt-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'USER';
            const isErrorMsg = msg.isError;

            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto'}`}
              >
                {/* Assistant Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Message Bubble Card */}
                <div className={`p-4 sm:p-5 rounded-3xl space-y-2.5 shadow-2xs relative group ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-sm max-w-xl text-xs sm:text-sm font-medium leading-relaxed' 
                    : isErrorMsg
                      ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200 rounded-tl-sm w-full sm:max-w-2xl'
                      : 'bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm w-full sm:max-w-2xl shadow-sm'
                }`}>
                  
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.message}</div>
                  ) : (
                    <FormattedMessage content={msg.message} />
                  )}

                  {/* Grounded Sources Pills (if RAG retrieved docs) */}
                  {!isUser && msg.retrieved_sources && msg.retrieved_sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center mr-1">
                        <BookOpen className="w-3 h-3 mr-1 text-blue-500" /> Grounded in:
                      </span>
                      {msg.retrieved_sources.map((src, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                          {src.title || src}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Bar (Copy & Retry) */}
                  {!isUser && !isErrorMsg && (
                    <div className="pt-1.5 flex items-center justify-end space-x-2 text-[11px] text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.message, idx)}
                        className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-700 transition flex items-center space-x-1"
                        title="Copy answer"
                      >
                        {copiedMsgIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 text-[10px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Retry Button on Error */}
                  {isErrorMsg && lastFailedQuery && (
                    <button
                      type="button"
                      onClick={() => handleSendMessage(lastFailedQuery)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start space-x-3 max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-3xl bg-white border border-slate-200 rounded-tl-sm shadow-2xs flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-xs text-slate-500 font-medium">Generating intelligent response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bottom Bar */}
        <div className="p-3 sm:p-5 bg-transparent shrink-0 z-10">
          <div className="max-w-3xl mx-auto space-y-2">
            <PromptInputBox
              value={inputQuery}
              onValueChange={setInputQuery}
              placeholder="Type your message here..."
              isLoading={loading}
              onSend={(msg, files) => handleSendMessage(msg, files)}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 font-medium px-2 drop-shadow-2xs">
              <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for newline</span>
              <span className="hidden sm:inline">Nexora AI Career & Recruitment Intelligence</span>
            </div>
          </div>
        </div>

      </main>

      {/* Confirmation Modal for Clearing History */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Clear All Chat History?</h3>
              <p className="text-xs text-slate-500">
                This will delete all saved conversations permanently. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAllHistory}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
