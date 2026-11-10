import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
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
  Terminal
} from 'lucide-react';

// Formatted Code Block component with Copy button
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 text-xs shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700/80 text-[11px] text-slate-400">
        <span className="font-mono uppercase font-bold flex items-center">
          <Terminal className="w-3 h-3 mr-1 text-blue-400" />
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-slate-700 text-slate-300 transition"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto font-mono text-[11px] leading-relaxed text-blue-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Markdown Formatter for Assistant messages
function FormattedMessage({ content }) {
  if (!content) return null;

  // Split by code fences: ```lang ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs leading-relaxed text-slate-800">
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

        // Process markdown text paragraphs, lists, bold
        const lines = part.split('\n');
        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;

              // Headings
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="font-bold text-navy-900 text-xs sm:text-sm pt-1">
                    {trimmed.replace(/^###\s+/, '')}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="font-extrabold text-navy-900 text-sm sm:text-base pt-1.5 border-b border-slate-200/60 pb-1">
                    {trimmed.replace(/^##\s+/, '')}
                  </h3>
                );
              }

              // Bullet items
              if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const bulletText = trimmed.replace(/^[•*-]\s+/, '');
                return (
                  <div key={lIdx} className="flex items-start space-x-2 pl-2">
                    <span className="text-blue-500 font-bold">•</span>
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

              // Standard paragraph
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

// Inline formatting (bold, backticks)
function formatInline(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-navy-900">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200/80 font-mono text-[11px] text-blue-700">$1</code>');
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState('');
  const [hasError, setHasError] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const messagesEndRef = useRef(null);
  const hasLoadedInitial = useRef(false);

  const suggestedPrompts = [
    "How can I optimize my resume for ATS software?",
    "Explain the STAR method for behavioral tech interviews",
    "Write a Python function to reverse a string with O(1) space",
    "What are the top skills needed for a Full Stack Developer in 2026?",
    "How do I prepare for a System Design interview?",
    "Give me advice on negotiating my first software engineer job offer"
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  // Handle continuation from Resume Checker
  useEffect(() => {
    if (hasLoadedInitial.current) return;
    if (location.state?.initialPrompt) {
      hasLoadedInitial.current = true;
      const initialText = location.state.initialPrompt;
      const contextText = location.state.context || '';
      
      const fullQuery = contextText 
        ? `${initialText}\n\n[Context from Resume Checker]:\n${contextText}` 
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
      const list = data.results || data;
      setConversations(list);
      if (list.length > 0 && !location.state?.initialPrompt) {
        selectConversation(list[0].id);
      } else if (!location.state?.initialPrompt) {
        setMessages([
          {
            sender: 'ASSISTANT',
            message: `Hello ${user?.full_name?.split(' ')[0] || 'there'}! I am Nexora's AI Career Assistant. I can help you with anything — general software concepts, coding challenges and bug debugging, interview preparation, or ATS resume tailoring. How can I assist you today?`,
            retrieved_sources: [],
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function selectConversation(convId) {
    setActiveConvId(convId);
    setHasError(false);
    try {
      const data = await api.getConversationDetail(convId);
      setMessages(data.messages || []);
    } catch (e) {
      console.error(e);
    }
  }

  const handleStartNewChat = () => {
    setActiveConvId(null);
    setHasError(false);
    setLastFailedQuery('');
    setMessages([
      {
        sender: 'ASSISTANT',
        message: `Started a fresh conversation! Ask me anything about programming, resume improvements, interview strategies, or tech careers.`,
        retrieved_sources: [],
        created_at: new Date().toISOString()
      }
    ]);
  };

  const handleSendMessage = async (queryText) => {
    const text = (queryText || inputQuery).trim();
    if (!text || loading) return;

    setHasError(false);
    setLastFailedQuery(text);

    const userMsg = {
      sender: 'USER',
      message: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.askAssistant({
        message: text,
        conversation_id: activeConvId
      });
      setActiveConvId(res.conversation_id);
      setMessages(prev => [...prev, res.message]);
      setLastFailedQuery('');

      // Refresh conversations list
      const convData = await api.getConversations();
      setConversations(convData.results || convData);
    } catch (err) {
      console.error(err);
      setHasError(true);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ASSISTANT',
          message: "I encountered an issue processing your request. Please click **Retry** below to resend your query.",
          retrieved_sources: [],
          created_at: new Date().toISOString(),
          is_error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all conversation history?")) return;
    try {
      await api.clearConversations();
      setConversations([]);
      setActiveConvId(null);
      setMessages([
        {
          sender: 'ASSISTANT',
          message: "Conversation history cleared. How can I help you today?",
          retrieved_sources: [],
          created_at: new Date().toISOString()
        }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Career & Technical Assistant</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
            AI Career Assistant
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleStartNewChat}
            className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> New Chat
          </button>
          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center shadow-sm transition"
            title="Clear all conversations"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear All
          </button>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Sidebar: Conversations */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 font-bold text-xs text-navy-900 flex items-center justify-between">
            <span className="flex items-center">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Chat History
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-[11px] text-slate-400">
                No past conversations. Click <strong>New Chat</strong> to begin.
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition truncate flex items-center space-x-2 ${
                    activeConvId === conv.id
                      ? 'bg-blue-100/70 text-navy-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-navy-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  <span className="truncate">{conv.title || 'Conversation'}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'USER';
              return (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-sm ${
                    isUser ? 'bg-navy-900 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs shadow-2xs ${
                    isUser
                      ? 'bg-navy-900 text-white leading-relaxed'
                      : msg.is_error
                        ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    ) : (
                      <FormattedMessage content={msg.message} />
                    )}

                    {/* Retry Button if Error */}
                    {msg.is_error && lastFailedQuery && (
                      <button
                        onClick={() => handleSendMessage(lastFailedQuery)}
                        className="mt-2 inline-flex items-center px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-sm transition"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" /> Retry Request
                      </button>
                    )}

                    {/* Grounded Source Citations */}
                    {!isUser && msg.retrieved_sources && msg.retrieved_sources.length > 0 && (
                      <div className="pt-3 mt-3 border-t border-slate-200/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Verified References:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.retrieved_sources.map((src, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs"
                            >
                              <BookOpen className="w-3 h-3 mr-1 text-blue-600" />
                              {src.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Thinking and preparing response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Bar */}
          {messages.length <= 2 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 self-center">Suggested Topics:</span>
              {suggestedPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-medium text-slate-700 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask any question — programming code, general knowledge, interview prep, or ATS resume advice..."
                className="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-xs text-navy-900"
              />
              <button
                type="submit"
                disabled={loading || !inputQuery.trim()}
                className="p-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl shadow transition disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
