'use client';

import { useEffect, useRef, useState } from 'react';
import { DiamondIcon, BoxIcon, RefreshIcon, TruckIcon, MinimizeIcon, CloseIcon } from './icons';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface QuickReply {
  label: string;
  text: string;
  icon: React.ReactNode;
}

const QUICK_REPLIES: QuickReply[] = [
  { label: 'Track order', text: 'Can you help me track my order?', icon: <BoxIcon /> },
  { label: 'Return policy', text: 'What is your return policy?', icon: <RefreshIcon /> },
  { label: 'Shipping info', text: 'How long does shipping take?', icon: <TruckIcon /> },
];

export function BeaconChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize: check localStorage and fetch history
  useEffect(() => {
    const initChat = async () => {
      const storedSessionId = localStorage.getItem('beaconSessionId');

      if (storedSessionId) {
        setSessionId(storedSessionId);
        try {
          const response = await fetch(
            `https://beacon-backend-fkxd.onrender.com/chat/history/${storedSessionId}`
          );
          if (response.ok) {
            const data = await response.json();
            const fetchedMessages: Message[] = (data.messages || [])
              .filter((msg: any) => msg.sender && msg.text && msg.text.trim().length > 0)
              .map((msg: any, idx: number) => ({
                id: `${storedSessionId}-${idx}`,
                role: msg.sender === 'user' ? 'user' : 'ai',
                content: msg.text,
                timestamp: new Date(msg.timestamp || Date.now()),
              }));
            setMessages(fetchedMessages);
          }
        } catch (err) {
          console.error('Failed to fetch chat history:', err);
        }
      } else {
        // New session: show welcome message
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'ai',
          content:
            'Hi! I\'m Beacon, your AI support assistant. I\'m here to help you with orders, shipping, returns, and more. What can I help you with today?',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    };

    initChat();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch('https://beacon-backend-fkxd.onrender.com/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: sessionId || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save new sessionId if it's a new session
        if (!sessionId && data.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem('beaconSessionId', data.sessionId);
        }

        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setShowSuggestions(false);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'ai',
        content:
          'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(
        'Failed to send message. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full">
      {/* Chat Window Card */}
      <div
        className="relative rounded-2xl border bg-black/40 backdrop-blur-2xl animate-in fade-in zoom-in-75 duration-300 overflow-hidden"
        style={{
          borderColor: 'rgba(99, 102, 241, 0.2)',
          borderWidth: '1px',
          width: '480px',
          height: '600px',
          boxShadow:
            '0 0 0 1px rgba(99, 102, 241, 0.2), 0 0 60px rgba(99, 102, 241, 0.12), 0 0 120px rgba(124, 58, 237, 0.06), 0 25px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Subtle inner glow at top */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
          }}
        />

        {/* Header */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{
            background: 'linear-gradient(to right, #0d0d2b, #0f0f35)',
            borderBottomImage: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Beacon" width={34} height={34} />
            <div>
              <p className="text-sm font-bold text-white">Beacon</p>
              <p className="text-xs text-indigo-400/60">AI Customer Support</p>
            </div>
          </div>

          {/* Right: Control icons */}
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-indigo-400/60 hover:text-indigo-400 transition-colors">
              <MinimizeIcon className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-indigo-400/60 hover:text-indigo-400 transition-colors">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div
          className="beacon-messages flex-1 overflow-y-auto px-5 py-4 space-y-4"
          style={{ height: 'calc(600px - 160px)' }}
        >
          {/* Quick reply suggestions - only show with welcome message */}
          {showSuggestions && messages.length === 1 && messages[0].role === 'ai' && (
            <div className="space-y-3 pt-2 pb-2">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(reply.text)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-all disabled:opacity-50 hover:border-indigo-400/60 hover:bg-indigo-400/8 text-indigo-300"
                    style={{
                      borderColor: 'rgba(99, 102, 241, 0.25)',
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    }}
                  >
                    <span className="text-indigo-400">{reply.icon}</span>
                    <span>{reply.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`animate-in fade-in slide-in-from-bottom-3 duration-500 ${
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-tr-sm'
                    : 'bg-white/5 border text-indigo-100 rounded-tl-sm'
                }`}
                style={
                  message.role === 'user'
                    ? {
                        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.35)',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      }
                    : {
                        borderColor: 'rgba(99, 102, 241, 0.15)',
                        backgroundColor: 'rgba(99, 102, 241, 0.07)',
                        backdropFilter: 'blur(8px)',
                      }
                }
              >
                {message.role === 'ai' && (
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <DiamondIcon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs text-indigo-400/50 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {message.role === 'user' && (
                  <div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs text-indigo-100/50 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 flex justify-start">
              <div
                className="text-indigo-100 px-4 py-3 rounded-2xl rounded-tl-sm border"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.07)',
                  borderColor: 'rgba(99, 102, 241, 0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex items-center gap-2">
                  <DiamondIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <div className="flex gap-2">
                    <div
                      className="w-2 h-2 rounded-full bg-indigo-400"
                      style={{
                        animation: 'bounce 1.4s infinite',
                        animationDelay: '0ms',
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-indigo-400"
                      style={{
                        animation: 'bounce 1.4s infinite',
                        animationDelay: '200ms',
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-indigo-400"
                      style={{
                        animation: 'bounce 1.4s infinite',
                        animationDelay: '400ms',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          className="px-4 py-3 backdrop-blur-sm"
          style={{
            borderTop: '1px solid rgba(99, 102, 241, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
          }}
        >
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={loading}
                className="w-full border rounded-lg px-4 py-2.5 text-sm text-white placeholder-indigo-300/40 focus:outline-none transition-all disabled:opacity-50"
                style={{
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                  e.currentTarget.style.boxShadow =
                    '0 0 20px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              className="text-white px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{
                background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                boxShadow: 'none',
              }}
              onMouseEnter={(e) => {
                if (!input.trim() || loading) return;
                e.currentTarget.style.boxShadow =
                  '0 0 20px rgba(124, 58, 237, 0.5)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              →
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-400/70 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
