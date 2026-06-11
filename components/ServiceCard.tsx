'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  index?: number;
  interactive?: boolean;
  type?: string;
  currentIndex?: number;
  isActive?: boolean;
}

const N8N_NODES = [
  { id: 0, label: 'Gmail', color: '#ea4335' },
  { id: 1, label: 'n8n', color: '#10b981' },
  { id: 2, label: 'Slack', color: '#4a154b' },
  { id: 3, label: 'Notion', color: '#64748b' },
] as const;

/** Same demo chrome height for every card — phone + laptop stay aligned. */
const DEMO_PANEL =
  'glass-inset flex h-[252px] flex-col overflow-hidden rounded-xl p-3 sm:h-[272px] sm:p-4 md:h-[292px]';

function DemoStatusBar({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="mb-2 flex shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 animate-smooth-pulse" />
        <span className="truncate text-xs font-medium text-emerald-300">{label}</span>
      </div>
      {hint ? <span className="hidden shrink-0 text-[10px] text-slate-500 sm:inline">{hint}</span> : null}
    </div>
  );
}

export default function ServiceCard({ icon: Icon, title, description, gradient, interactive = false, type, isActive = false }: ServiceCardProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'ai', message: "Hi! I'm an AI Agent. Ask me anything about how I can help your business!" }
  ]);
  const [botMessage, setBotMessage] = useState('');
  const [botHistory, setBotHistory] = useState([
    { type: 'ai', message: "Hello! I'm your AI assistant. Upload a document to get started, or ask me anything!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sessionId] = useState(() => `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [activeNode, setActiveNode] = useState(0);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Auto-advance n8n nodes — delayed until crossfade finishes; paused when hidden
  useEffect(() => {
    if (type !== 'n8n-automations' || !isActive) {
      setActiveNode(0);
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    let startTimeout: ReturnType<typeof setTimeout> | undefined;

    const stop = () => {
      if (startTimeout) {
        clearTimeout(startTimeout);
        startTimeout = undefined;
      }
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    };

    const start = () => {
      if (interval) return;
      interval = setInterval(() => {
        setActiveNode((prev) => (prev + 1) % N8N_NODES.length);
      }, 1600);
    };

    const scheduleStart = () => {
      stop();
      setActiveNode(0);
      startTimeout = setTimeout(() => {
        if (document.visibilityState === 'visible') start();
      }, 520);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && isActive) scheduleStart();
      else stop();
    };

    scheduleStart();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [type, isActive]);

  // Auto-scroll chat history to bottom when new messages arrive
  useEffect(() => {
    if (type === 'chatbot' && chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [botHistory, isTyping, type]);

  return (
    <div className="relative group cursor-pointer h-full w-full">
      {/* Simple glow effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 transition-opacity duration-300 ease-smooth group-hover:opacity-[0.18] md:group-hover:opacity-25`}
      />

      {/* Frosted shell: stacked Services cards need opacity + blur so back cards don’t bleed through */}
      <div className="relative isolate w-full overflow-hidden rounded-2xl p-4 glass-dense sm:p-5 md:p-6">
        <div className="relative z-10 flex flex-col">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 md:h-11 md:w-11">
              {Icon ? <Icon className="h-5 w-5 text-white" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold leading-snug text-white md:text-lg">{title}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-snug text-slate-400">{description}</p>
            </div>
          </div>

          {interactive && isActive && (
            <div className={DEMO_PANEL}>
              {type === 'ai-agent' && (
                <div className="flex flex-col h-full min-h-0">
                  <div className="flex items-center gap-2 mb-[2%]" style={{ gap: 'clamp(0.25rem, 1%, 0.5rem)', marginBottom: 'clamp(0.5rem, 2%, 1rem)' }}>
                    <div className="bg-emerald-500 rounded-full animate-smooth-pulse" style={{ width: 'clamp(6px, 1.5%, 8px)', height: 'clamp(6px, 1.5%, 8px)' }}></div>
                    <span className="text-emerald-400 font-medium" style={{ fontSize: 'clamp(0.625rem, 2vw, 0.875rem)' }}>Live Demo</span>
                  </div>
                  
                  {/* Chat Interface */}
                  <div className="bg-slate-900/50 rounded-lg flex-1 overflow-y-auto space-y-2 min-h-0" style={{ 
                    padding: 'clamp(0.5rem, 2%, 1rem)',
                    maxHeight: '60%',
                    gap: 'clamp(0.5rem, 1.5%, 0.75rem)'
                  }}>
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-700 text-slate-200'
                        }`} style={{ 
                          padding: 'clamp(0.5rem, 2%, 0.75rem)',
                          fontSize: 'clamp(0.625rem, 2vw, 0.875rem)'
                        }}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Input */}
                  <div className="flex gap-2 mt-[2%] flex-shrink-0" style={{ gap: 'clamp(0.25rem, 1%, 0.5rem)', marginTop: 'clamp(0.5rem, 2%, 1rem)' }}>
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                      style={{ 
                        padding: 'clamp(0.375rem, 2%, 0.5rem)',
                        fontSize: 'clamp(1rem, 2.5vw, 1rem)'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && chatMessage.trim()) {
                          setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
                          setChatHistory(prev => [...prev, { type: 'ai', message: "I'd be happy to help! AI agents can integrate with your CRM, process customer requests, analyze sentiment, schedule appointments, and much more. The possibilities are endless!" }]);
                          setChatMessage('');
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (chatMessage.trim()) {
                          setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
                          setChatHistory(prev => [...prev, { type: 'ai', message: "I'd be happy to help! AI agents can integrate with your CRM, process customer requests, analyze sentiment, schedule appointments, and much more. The possibilities are endless!" }]);
                          setChatMessage('');
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center"
                      style={{ 
                        padding: 'clamp(0.375rem, 2%, 0.5rem)',
                        minWidth: 'clamp(2rem, 8%, 2.5rem)'
                      }}
                    >
                      <svg className="flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
              </div>
              )}

              {type === 'voice-agent' && (
                <div className="flex-1 flex flex-col justify-center min-h-0" style={{ gap: 'clamp(0.75rem, 3%, 1.25rem)' }}>
                  <div className="text-center" style={{ gap: 'clamp(0.5rem, 2%, 0.75rem)' }}>
                    <h4 className="text-white font-semibold mb-[1%]" style={{ fontSize: 'clamp(0.875rem, 3.5vw, 1.25rem)', marginBottom: 'clamp(0.25rem, 1%, 0.5rem)' }}>Try Our Voice Agent</h4>
                    <p className="text-slate-400 px-2" style={{ fontSize: 'clamp(0.625rem, 2vw, 0.875rem)', paddingLeft: 'clamp(0.25rem, 1%, 0.5rem)', paddingRight: 'clamp(0.25rem, 1%, 0.5rem)' }}>Enter your phone number to receive a demo call from our AI voice agent</p>
                  </div>

                  <div style={{ gap: 'clamp(0.75rem, 3%, 1rem)' }}>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setCallStatus({ type: null, message: '' });
                      }}
                      placeholder="+1 (217) 555-1234"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        padding: 'clamp(0.5rem, 2.5%, 0.75rem)',
                        fontSize: 'clamp(1rem, 3vw, 1.125rem)'
                      }}
                      disabled={isCalling}
                    />
                    <p className="text-slate-500 text-center px-2" style={{ 
                      fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      paddingLeft: 'clamp(0.25rem, 1%, 0.5rem)',
                      paddingRight: 'clamp(0.25rem, 1%, 0.5rem)',
                      marginTop: 'clamp(0.5rem, 2%, 0.75rem)'
                    }}>
                      Enter a US phone number (+1) to receive the call
                    </p>
                    
                    {callStatus.type && (
                      <div className={`rounded-lg whitespace-pre-line ${
                        callStatus.type === 'success' 
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/20 border border-red-500/30 text-red-300'
                      }`} style={{ 
                        padding: 'clamp(0.5rem, 2%, 0.75rem)',
                        fontSize: 'clamp(0.625rem, 2vw, 0.875rem)',
                        marginTop: 'clamp(0.5rem, 2%, 0.75rem)'
                      }}>
                        {callStatus.message}
                      </div>
                    )}
                    
                    <button 
                      onClick={async () => {
                        if (!phoneNumber.trim()) {
                          setCallStatus({ type: 'error', message: 'Please enter a phone number' });
                          return;
                        }

                        setIsCalling(true);
                        setCallStatus({ type: null, message: '' });

                        try {
                          const response = await fetch('/api/vapi/call', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ phoneNumber }),
                          });

                          const data = await response.json();

                          if (response.ok) {
                            setCallStatus({ 
                              type: 'success', 
                              message: data.message || 'Call initiated! You should receive a call shortly.' 
                            });
                            setPhoneNumber(''); // Clear input after success
                          } else {
                            // Extract detailed error message
                            let errorMsg = 'Failed to initiate call. ';
                            if (data.error) {
                              errorMsg += data.error;
                            } else if (data.message) {
                              errorMsg += data.message;
                            } else if (data.details) {
                              const details = typeof data.details === 'string' ? data.details : JSON.stringify(data.details);
                              errorMsg += details;
                            } else {
                              errorMsg += 'Please check server logs for details.';
                            }
                            
                            console.error('❌ API Error:', data);
                            setCallStatus({ 
                              type: 'error', 
                              message: errorMsg
                            });
                          }
                        } catch (error) {
                          console.error('❌ Error calling Vapi API:', error);
                          setCallStatus({ 
                            type: 'error', 
                            message: error instanceof Error 
                              ? `Network error: ${error.message}` 
                              : 'Network error. Please check your connection and try again.' 
                          });
                        } finally {
                          setIsCalling(false);
                        }
                      }}
                      disabled={isCalling}
                      className="btn-glass-primary flex w-full items-center justify-center gap-2 rounded-lg font-medium text-white disabled:cursor-not-allowed"
                      style={{ 
                        padding: 'clamp(0.5rem, 2.5%, 0.75rem)',
                        fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
                        gap: 'clamp(0.25rem, 1%, 0.5rem)',
                        marginTop: 'clamp(0.5rem, 2%, 0.75rem)'
                      }}
                    >
                      {isCalling ? (
                        <>
                          <div className="border-2 border-white border-t-transparent rounded-full animate-smooth-spin" style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }}></div>
                          <span>Initiating Call...</span>
                        </>
                      ) : (
                        <>
                          <svg className="flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>Start Demo Call</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {type === 'chatbot' && (
                <div className="flex flex-col h-full min-h-0">
                  <div className="text-center mb-[1.5%] flex-shrink-0" style={{ marginBottom: 'clamp(0.5rem, 1.5%, 0.75rem)' }}>
                    <h4 className="text-white font-semibold mb-[0.5%]" style={{ 
                      fontSize: 'clamp(0.875rem, 3.5vw, 1.25rem)',
                      marginBottom: 'clamp(0.25rem, 0.5%, 0.5rem)'
                    }}>AI Chatbot with Document Q&A</h4>
                    <p className="text-slate-400" style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Upload documents and ask questions about them</p>
                  </div>

                  {/* Document Upload Section */}
                  <div className="mb-[1.5%] flex gap-2 flex-shrink-0" style={{ 
                    marginBottom: 'clamp(0.5rem, 1.5%, 0.75rem)',
                    gap: 'clamp(0.25rem, 1%, 0.5rem)'
                  }}>
                    <label className="flex-1 block">
                      <input
                        type="file"
                        accept=".txt,.pdf,.doc,.docx,.md"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setIsUploading(true);
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('sessionId', sessionId);

                          try {
                            const response = await fetch('/api/chatbot/upload', {
                              method: 'POST',
                              body: formData,
                            });

                            const data = await response.json();

                            if (response.ok) {
                              setUploadedFile({ name: file.name, size: file.size });
                              setBotHistory(prev => [...prev, {
                                type: 'ai',
                                message: `✅ Document "${file.name}" uploaded successfully! I can now answer questions about it.`
                              }]);
                            } else {
                              setBotHistory(prev => [...prev, {
                                type: 'ai',
                                message: `❌ Error: ${data.error || 'Failed to upload document'}`
                              }]);
                            }
                          } catch {
                            setBotHistory(prev => [...prev, {
                              type: 'ai',
                              message: '❌ Failed to upload document. Please try again.'
                            }]);
                          } finally {
                            setIsUploading(false);
                            // Reset file input
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <div className={`flex items-center rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                        isUploading
                          ? 'border-emerald-500 bg-emerald-500/10 cursor-wait'
                          : 'border-slate-600 hover:border-emerald-500/50 bg-slate-800/50'
                      }`} style={{ 
                        gap: 'clamp(0.25rem, 1%, 0.5rem)',
                        padding: 'clamp(0.375rem, 2%, 0.5rem)'
                      }}>
                        {isUploading ? (
                          <>
                            <div className="border-2 border-emerald-500 border-t-transparent rounded-full animate-smooth-spin" style={{ width: 'clamp(10px, 2.5vw, 12px)', height: 'clamp(10px, 2.5vw, 12px)' }}></div>
                            <span className="text-emerald-400" style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <svg className="text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 'clamp(14px, 3.5vw, 16px)', height: 'clamp(14px, 3.5vw, 16px)' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-slate-300 truncate" style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                              {uploadedFile ? `📄 ${uploadedFile.name.substring(0, 20)}${uploadedFile.name.length > 20 ? '...' : ''}` : 'Upload Document'}
                            </span>
                          </>
                        )}
                      </div>
                    </label>
                    {uploadedFile && (
                      <button
                        onClick={async () => {
                          // Clear document from backend
                          try {
                            await fetch('/api/chatbot/clear', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ sessionId }),
                            });
                          } catch {
                            // Ignore errors
                          }
                          setUploadedFile(null);
                          setBotHistory([{ type: 'ai', message: "Document cleared. Upload a new document or ask me anything!" }]);
                        }}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg border border-red-500/30 transition-colors flex-shrink-0 flex items-center justify-center"
                        style={{ 
                          padding: 'clamp(0.375rem, 2%, 0.5rem)',
                          minWidth: 'clamp(2rem, 8%, 2.5rem)'
                        }}
                        title="Clear document"
                      >
                        <svg className="flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 'clamp(14px, 3.5vw, 16px)', height: 'clamp(14px, 3.5vw, 16px)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Chat History */}
                  <div 
                    ref={chatHistoryRef}
                    className="bg-slate-900/50 rounded-lg flex-1 overflow-y-auto mb-[1.5%] min-h-0 scroll-smooth" 
                    style={{ 
                      padding: 'clamp(0.5rem, 2%, 0.75rem)',
                      marginBottom: 'clamp(0.5rem, 1.5%, 0.75rem)',
                      maxHeight: '50%'
                    }}
                  >
                    <div style={{ gap: 'clamp(0.25rem, 1%, 0.5rem)' }}>
                      {botHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`} style={{ marginBottom: 'clamp(0.25rem, 1%, 0.5rem)' }}>
                          <div className={`max-w-[85%] rounded-lg ${
                            msg.type === 'user' 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-700 text-slate-200'
                          }`} style={{ 
                            padding: 'clamp(0.375rem, 1.5%, 0.5rem)',
                            fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)'
                          }}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-slate-700 text-slate-200 rounded-lg" style={{ padding: 'clamp(0.375rem, 1.5%, 0.5rem)' }}>
                            <div className="flex" style={{ gap: 'clamp(2px, 0.5vw, 4px)' }}>
                              <div className="bg-emerald-400 rounded-full animate-smooth-bounce" style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', animationDelay: '0ms' }}></div>
                              <div className="bg-emerald-400 rounded-full animate-smooth-bounce" style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', animationDelay: '150ms' }}></div>
                              <div className="bg-emerald-400 rounded-full animate-smooth-bounce" style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2 flex-shrink-0" style={{ gap: 'clamp(0.25rem, 1%, 0.5rem)' }}>
                    <input
                      type="text"
                      value={botMessage}
                      onChange={(e) => setBotMessage(e.target.value)}
                      placeholder={uploadedFile ? "Ask about your document..." : "Ask me anything..."}
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                      style={{ 
                        padding: 'clamp(0.5rem, 2%, 0.625rem)',
                        fontSize: 'clamp(1rem, 2.5vw, 1rem)'
                      }}
                      onKeyPress={async (e) => {
                        if (e.key === 'Enter' && botMessage.trim() && !isTyping) {
                          const userMessage = botMessage;
                          setBotMessage('');
                          setBotHistory(prev => [...prev, { type: 'user', message: userMessage }]);
                          setIsTyping(true);

                          try {
                            const response = await fetch('/api/chatbot', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ message: userMessage, sessionId }),
                            });

                            const data = await response.json();
                            setBotHistory(prev => [...prev, {
                              type: 'ai',
                              message: data.response || 'Sorry, I encountered an error.'
                            }]);
                          } catch {
                            setBotHistory(prev => [...prev, {
                              type: 'ai',
                              message: 'Sorry, I encountered an error. Please try again.'
                            }]);
                          } finally {
                            setIsTyping(false);
                          }
                        }
                      }}
                      disabled={isTyping}
                    />
                    <button
                      onClick={async () => {
                        if (botMessage.trim() && !isTyping) {
                          const userMessage = botMessage;
                          setBotMessage('');
                          setBotHistory(prev => [...prev, { type: 'user', message: userMessage }]);
                          setIsTyping(true);

                          try {
                            const response = await fetch('/api/chatbot', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ message: userMessage, sessionId }),
                            });

                            const data = await response.json();
                            setBotHistory(prev => [...prev, {
                              type: 'ai',
                              message: data.response || 'Sorry, I encountered an error.'
                            }]);
                          } catch {
                            setBotHistory(prev => [...prev, {
                              type: 'ai',
                              message: 'Sorry, I encountered an error. Please try again.'
                            }]);
                          } finally {
                            setIsTyping(false);
                          }
                        }
                      }}
                      disabled={isTyping || !botMessage.trim()}
                      className="btn-glass-primary flex flex-shrink-0 items-center justify-center rounded-lg font-medium text-white disabled:cursor-not-allowed"
                      style={{ 
                        padding: 'clamp(0.5rem, 2%, 0.625rem)',
                        fontSize: 'clamp(0.625rem, 2vw, 0.875rem)',
                        minWidth: 'clamp(3rem, 12%, 4rem)'
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {type === 'n8n-automations' && (
                <div className="flex h-full min-h-0 flex-col">
                  <DemoStatusBar label="Integration demo" hint="Gmail → n8n → Slack/Notion" />

                  <div className="flex min-h-0 flex-1 items-center justify-center gap-0.5 px-0.5 sm:gap-1.5">
                    {N8N_NODES.map((node, idx) => (
                      <React.Fragment key={node.id}>
                        <div
                          className={`flex w-[4.25rem] shrink-0 flex-col items-center gap-1 rounded-lg border px-1 py-2 transition-[border-color,background-color,transform] duration-500 ease-smooth sm:w-[4.75rem] ${
                            activeNode === idx
                              ? 'scale-[1.02] border-emerald-500/40 bg-emerald-500/10'
                              : 'scale-100 border-transparent bg-white/[0.02]'
                          }`}
                        >
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-white transition-[background-color,transform] duration-500 ease-smooth sm:h-9 sm:w-9"
                            style={{
                              backgroundColor: activeNode === idx ? node.color : '#374151',
                              transform: activeNode === idx ? 'scale(1.05)' : 'scale(1)',
                            }}
                          >
                            {node.label.slice(0, 1)}
                          </div>
                          <span className="text-[10px] font-medium text-slate-300 sm:text-[11px]">{node.label}</span>
                        </div>
                        {idx < N8N_NODES.length - 1 && (
                          <span className="shrink-0 px-0.5 text-[10px] text-slate-600 sm:text-xs" aria-hidden>
                            →
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <p className="mt-auto shrink-0 pt-2 text-center text-[11px] leading-snug text-slate-500">
                    Email in → n8n routes → Slack &amp; Notion stay in sync
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient}`} />
      </div>
    </div>
  );
}
