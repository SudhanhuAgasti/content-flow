import React, { useState, useRef, useEffect } from 'react';
import { contentService } from '../../services/contentService.js';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Copy,
  Check,
  HelpCircle,
  Code2,
  Lightbulb,
  Scale,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * AskTheArticleCopilot
 * --------------------
 * High-production RAG AI Copilot for interactive article comprehension:
 * - Floating launch trigger (bottom-right above progress bar pill)
 * - Sleek slide-over drawer / modal on desktop & full sheet on mobile
 * - Grounded RAG Q&A with one-click prompt pills
 * - Markdown rendering (code blocks, lists, quotes, bolding)
 * - Copy response to clipboard with feedback
 */

const QUICK_PROMPTS = [
  {
    icon: Lightbulb,
    label: 'Simplify 2nd paragraph',
    query: 'Explain the 2nd paragraph in simpler words with key takeaways.',
  },
  {
    icon: Code2,
    label: 'Code examples',
    query: 'Give me production code examples based on this concept.',
  },
  {
    icon: Scale,
    label: 'Trade-offs & Pros/Cons',
    query: 'What are the main engineering trade-offs and downsides mentioned here?',
  },
  {
    icon: HelpCircle,
    label: 'Core synopsis',
    query: 'Summarize the core argument of this article in 3 actionable bullet points.',
  },
];

export const AskTheArticleCopilot = ({ article }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Chat message history initialized with intelligent greeting
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'copilot',
      text: `👋 Hi! I'm your **Article Copilot** for *"**${article?.title || 'this story'}**"*.\n\nYou can ask me anything about this article without leaving the page — from code implementations and technical trade-offs to simplified explanations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Handle message submission
  const handleSend = async (customQuery) => {
    const activeQuery = (customQuery || query).trim();
    if (!activeQuery || loading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg = {
      id: userMessageId,
      sender: 'user',
      text: activeQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await contentService.askArticleCopilot(article.slug, activeQuery);
      if (res.success && res.data?.answer) {
        setMessages((prev) => [
          ...prev,
          {
            id: `copilot-${Date.now()}`,
            sender: 'copilot',
            text: res.data.answer,
            source: res.data.source,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(res.message || 'Failed to generate answer');
      }
    } catch (err) {
      console.error('Copilot request error:', err);
      toast.error('AI Copilot request failed', {
        description: err.message || 'Unable to connect to the RAG synthesis engine.',
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `copilot-err-${Date.now()}`,
          sender: 'copilot',
          isError: true,
          text: `⚠️ **Could not process query:** ${err.message || 'Please verify your network connection and try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Minimal safe Markdown formatter
  const renderFormattedMarkdown = (text) => {
    if (!text) return null;

    // Split on code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const lang = /^[a-z]+$/i.test(firstLine) ? firstLine : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={pIdx} className="my-2.5 rounded-xl overflow-hidden border border-obsidian-750 bg-obsidian-950 font-mono text-[11px] leading-relaxed">
            {lang && (
              <div className="px-3 py-1 bg-obsidian-900 border-b border-obsidian-800 text-[10px] text-obsidian-400 font-bold uppercase tracking-wider">
                {lang}
              </div>
            )}
            <pre className="p-3 text-jade-300 overflow-x-auto whitespace-pre">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Render standard paragraph markdown (headers, bold, quotes, lists)
      const paragraphs = part.split(/\n\s*\n/);
      return paragraphs.map((para, paraIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Header ###
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={`${pIdx}-${paraIdx}`} className="text-xs font-bold text-emperor-400 mt-2.5 mb-1 tracking-tight flex items-center gap-1.5 font-mono uppercase">
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }

        // Blockquote >
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ');
          return (
            <blockquote key={`${pIdx}-${paraIdx}`} className="my-2 pl-3 py-1 border-l-2 border-emperor-500/60 bg-emperor-500/5 text-obsidian-200 text-xs italic rounded-r-lg">
              {quoteLines}
            </blockquote>
          );
        }

        // List item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n');
          return (
            <ul key={`${pIdx}-${paraIdx}`} className="my-2 space-y-1 pl-1 text-xs text-obsidian-200">
              {items.map((item, iIdx) => {
                const itemClean = item.replace(/^([-*]|\d+\.)\s+/, '');
                return (
                  <li key={iIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emperor-400 mt-1.5 shrink-0" />
                    <span>{parseInlineFormatting(itemClean)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={`${pIdx}-${paraIdx}`} className="text-xs sm:text-[13px] leading-relaxed text-obsidian-200 my-1.5">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      });
    });
  };

  const parseInlineFormatting = (str) => {
    // Regex for bold **text**, inline `code`, and *italic*
    const tokens = str.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return tokens.map((token, tIdx) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={tIdx} className="font-bold text-white">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return <code key={tIdx} className="px-1.5 py-0.5 rounded bg-obsidian-800 text-emperor-300 font-mono text-[11px] border border-obsidian-700">{token.slice(1, -1)}</code>;
      }
      if (token.startsWith('*') && token.endsWith('*')) {
        return <em key={tIdx} className="italic text-obsidian-100">{token.slice(1, -1)}</em>;
      }
      return token;
    });
  };

  return (
    <>
      {/* 1. Floating Launch Trigger Button (Sleek Glassmorphic with Golden AI Badge) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-[9990] group flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-obsidian-900/95 via-obsidian-850/95 to-obsidian-900/95 border border-emperor-500/40 text-white shadow-[0_8px_30px_rgba(245,184,0,0.25)] hover:border-emperor-400 hover:shadow-[0_12px_40px_rgba(245,184,0,0.35)] backdrop-blur-xl transition-all duration-300 active:scale-95 select-none"
        title="Ask the Article AI Copilot"
      >
        <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-tr from-emperor-500 to-amber-300 text-obsidian-950 font-bold shadow-md shadow-emperor-500/40 group-hover:rotate-12 transition-transform">
          <Sparkles className="w-4 h-4 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-jade-400 border-2 border-obsidian-950 animate-pulse" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emperor-400 leading-none">
            Ask Copilot
          </div>
          <div className="text-[10px] text-obsidian-400 font-medium">
            RAG on this Story
          </div>
        </div>
      </button>

      {/* 2. Interactive Copilot Slide-over Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-end sm:p-6 pointer-events-none">
          {/* Backdrop (tap to dismiss on mobile) */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity animate-in fade-in duration-300"
          />

          {/* Drawer Window */}
          <div
            className={`pointer-events-auto relative flex flex-col bg-obsidian-950/95 border border-obsidian-750/90 sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-300 w-full ${
              isExpanded
                ? 'sm:w-[720px] h-[92vh] sm:h-[85vh]'
                : 'sm:w-[460px] h-[85vh] sm:h-[620px]'
            } rounded-t-3xl sm:rounded-b-3xl overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-right-8 duration-300`}
          >
            {/* Top Header */}
            <div className="px-5 py-4 border-b border-obsidian-800/80 bg-gradient-to-r from-obsidian-900/90 via-obsidian-850/90 to-obsidian-900/90 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emperor-500 to-amber-400 text-obsidian-950 flex items-center justify-center shadow-md shadow-emperor-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Article AI Copilot
                    </h3>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emperor-500/20 text-emperor-300 border border-emperor-500/30">
                      RAG Active
                    </span>
                  </div>
                  <p className="text-[10px] text-obsidian-400 truncate max-w-[220px] sm:max-w-[280px]">
                    Context: {article?.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-obsidian-400">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:flex p-1.5 rounded-lg hover:bg-obsidian-800 hover:text-white transition-colors"
                  title={isExpanded ? 'Collapse size' : 'Expand size'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-obsidian-800 hover:text-white transition-colors"
                  title="Close Copilot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Pills Bar */}
            <div className="px-4 py-2.5 bg-obsidian-900/60 border-b border-obsidian-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              {QUICK_PROMPTS.map((qp, idx) => {
                const Icon = qp.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(qp.query)}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-obsidian-850 hover:bg-emperor-500/20 border border-obsidian-750 hover:border-emperor-500/40 text-[11px] font-mono text-obsidian-300 hover:text-emperor-300 transition-all shrink-0 active:scale-95 disabled:opacity-50"
                  >
                    <Icon className="w-3 h-3 text-emperor-400" />
                    <span>{qp.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Chat Messages Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in-50 duration-200`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-obsidian-850 border border-obsidian-750 text-emperor-400 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`relative group max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm ${
                        isUser
                          ? 'bg-emperor-500 text-obsidian-950 font-medium rounded-tr-sm shadow-md shadow-emperor-500/20'
                          : msg.isError
                          ? 'bg-crimson-950/40 border border-crimson-800/60 text-crimson-200 rounded-tl-sm'
                          : 'bg-obsidian-900/90 border border-obsidian-800 text-obsidian-100 rounded-tl-sm shadow-surface-card'
                      }`}
                    >
                      {/* Copy Action button for AI responses */}
                      {!isUser && !msg.isError && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.text, idx)}
                          className="absolute top-2.5 right-2.5 p-1 rounded-md bg-obsidian-850/80 hover:bg-obsidian-800 text-obsidian-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                          title="Copy answer"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3 h-3 text-jade-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}

                      {/* Content Body */}
                      <div className="pr-5">
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          renderFormattedMarkdown(msg.text)
                        )}
                      </div>

                      {/* Meta Footer */}
                      <div
                        className={`mt-1.5 flex items-center gap-2 text-[9px] font-mono select-none ${
                          isUser ? 'text-obsidian-900/70 justify-end' : 'text-obsidian-500'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.source && (
                          <>
                            <span>&bull;</span>
                            <span className="text-jade-400 font-semibold">{msg.source}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-emperor-500/20 border border-emperor-500/40 text-emperor-400 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Live Loading Indicator */}
              {loading && (
                <div className="flex gap-2.5 justify-start animate-in fade-in duration-200">
                  <div className="w-7 h-7 rounded-lg bg-obsidian-850 border border-obsidian-750 text-emperor-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="bg-obsidian-900/90 border border-obsidian-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2.5 text-xs text-obsidian-300 font-mono">
                    <Loader2 className="w-4 h-4 text-emperor-400 animate-spin" />
                    <span>Analyzing article context & synthesizing answer...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer Bar */}
            <div className="p-3 sm:p-4 bg-obsidian-900/95 border-t border-obsidian-800/80 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything about this story... (e.g. explain, trade-offs)"
                    disabled={loading}
                    className="w-full pl-3.5 pr-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-750 focus:border-emperor-500 text-xs text-white placeholder-obsidian-500 focus:outline-none focus:ring-1 focus:ring-emperor-500/40 transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!query.trim() || loading}
                  className="p-2.5 rounded-xl bg-emperor-500 hover:bg-emperor-400 disabled:opacity-40 disabled:hover:bg-emperor-500 text-obsidian-950 font-bold transition-all shadow-md shadow-emperor-500/25 active:scale-95 shrink-0"
                  title="Send question"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
              <div className="mt-2 text-center text-[10px] text-obsidian-500 font-mono">
                Grounded directly in article content &bull; Zero external context-switching
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AskTheArticleCopilot;
