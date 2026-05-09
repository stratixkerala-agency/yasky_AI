'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Bot,
  Loader2,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleById, AI_ROLES } from '@/lib/prompts';
import { sendToAI, ChatMessage, createMessageId } from '@/lib/ai';
import { formatTimestamp, cn } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import ReactMarkdown from 'react-markdown';
import Sidebar from '@/components/layout/Sidebar';

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const roleId = params.roleId as string;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const role = getRoleById(roleId);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !role) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const history = messages.slice(-10);
      const response = await sendToAI(role.systemPrompt, userMessage.content, history);
      
      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const copyToClipboard = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const renderIcon = (icon: string | React.ElementType) => {
    if (typeof icon === 'string') {
      return <span className="text-xl">{icon}</span>;
    }
    const IconComponent = icon;
    return <IconComponent className="w-5 h-5 text-white" />;
  };

  if (!user || !role) {
    return null;
  }

  const gradientClass = AI_ROLES.find(r => r.id === roleId)?.color || 'from-purple-500 to-pink-500';

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="pl-64">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>

      <header className="relative border-b border-zinc-800/60 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="flex items-center justify-center w-10 h-10 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-400" />
              </Link>
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', gradientClass)}>
                  {renderIcon(role.icon)}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">{role.name}</h1>
                  <p className="text-xs text-zinc-500">AI Assistant</p>
                </div>
              </div>
            </div>
            <a
                        href="https://stratixagency.site"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                        onMouseEnter={e => { const child = e.currentTarget.firstElementChild as HTMLDivElement | null; if (child) { child.style.background = "rgba(255,255,255,0.2)"; child.style.boxShadow = "0 6px 28px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3)"; child.style.transform = "translateY(-2px)"; } }}
                        onMouseLeave={e => { const child = e.currentTarget.firstElementChild as HTMLDivElement | null; if (child) { child.style.background = "rgba(255,255,255,0.12)"; child.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25)"; child.style.transform = "translateY(0)"; } }}
                    >
                        <div style={{
                            position: "fixed", bottom: "24px", right: "24px", zIndex: 999,
                            backdropFilter: "blur(12px) saturate(160%)",
                            WebkitBackdropFilter: "blur(12px) saturate(160%)",
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.22)",
                            borderRadius: "8px",
                            padding: "7px 14px",
                            display: "flex", alignItems: "center", gap: "7px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25)",
                            cursor: "pointer", userSelect: "none",
                            transition: "background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
                        }}>
                            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                                <path d="M3 3 L17 17 M17 3 L3 17" stroke="#8B9FD4" strokeWidth="2.8" strokeLinecap="round" />
                                <path d="M5 3 L19 17 M19 3 L5 17" stroke="#B0C0E8" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
                            </svg>
                            <span style={{
                                fontFamily: "'DM Sans',sans-serif", fontSize: "0.61rem", fontWeight: "600",
                                letterSpacing: "0.07em", color: "rgba(255,255,255,0.72)", whiteSpace: "nowrap",
                            }}>Built by <span style={{ color: "#A8B8E8", fontWeight: "700" }}>Stratix</span></span>
                        </div>
                    </a>
          </div>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6', gradientClass)}>
                {renderIcon(role.icon)}
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Start a conversation</h2>
              <p className="text-zinc-400 text-center max-w-md mb-8">
                {role.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                {role.quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 rounded-xl text-left transition-all duration-200 group"
                  >
                    <Zap className="w-4 h-4 text-purple-500 group-hover:text-purple-400" />
                    <span className="text-sm text-zinc-300 group-hover:text-white">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-4',
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    message.role === 'user' 
                      ? 'bg-zinc-700' 
                      : `bg-gradient-to-br ${gradientClass}`
                  )}>
                    {message.role === 'user' ? (
                      <span className="text-sm font-medium text-white">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={cn(
                    'max-w-[75%] rounded-2xl p-4',
                    message.role === 'user' 
                      ? 'bg-zinc-800/80 border border-zinc-700/50' 
                      : 'bg-zinc-900/60 border border-zinc-800/60'
                  )}>
                    {message.role === 'assistant' && (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="text-zinc-300 leading-relaxed mb-3 last:mb-0">{children}</p>,
                            h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-md font-semibold text-white mt-3 mb-2">{children}</h3>,
                            ul: ({ children }) => <ul className="list-disc list-inside text-zinc-300 space-y-1 my-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside text-zinc-300 space-y-1 my-2">{children}</ol>,
                            li: ({ children }) => <li className="text-zinc-300">{children}</li>,
                            strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                            code: ({ children }) => <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-purple-400 text-sm">{children}</code>,
                            pre: ({ children }) => <pre className="bg-zinc-800 p-3 rounded-lg overflow-x-auto my-2">{children}</pre>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {message.role === 'user' && (
                      <p className="text-zinc-200 whitespace-pre-wrap">{message.content}</p>
                    )}
                    <div className={cn(
                      'flex items-center justify-between mt-3 pt-3 border-t',
                      message.role === 'user' ? 'border-zinc-700/50' : 'border-zinc-800/50'
                    )}>
                      <span className="text-xs text-zinc-500">
                        {formatTimestamp(message.timestamp)}
                      </span>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copiedId === message.id ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', `bg-gradient-to-br ${gradientClass}`)}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      <footer className="relative border-t border-zinc-800/60 bg-zinc-900/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none max-h-32"
                style={{ minHeight: '48px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200',
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 shadow-lg shadow-purple-500/25'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </footer>
      </div>
    </div>
  );
}