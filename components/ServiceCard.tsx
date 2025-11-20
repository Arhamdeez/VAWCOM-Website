'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay: number;
  index?: number;
  interactive?: boolean;
  type?: string;
  currentIndex?: number;
  isActive?: boolean;
}

export default function ServiceCard({ icon: Icon, title, description, gradient, delay = 0, interactive = false, type, isActive = false }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
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

  // Auto-advance n8n workflow nodes
  useEffect(() => {
    if (type === 'n8n-automations' && isActive) {
      const interval = setInterval(() => {
        setActiveNode((prev) => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [type, isActive]);

  // Auto-scroll chat history to bottom when new messages arrive
  useEffect(() => {
    if (type === 'chatbot' && chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [botHistory, isTyping, type]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer h-full w-full"
    >
      {/* Simple glow effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
      />

      {/* Main card */}
      <div className={`relative w-full h-full min-h-[400px] p-[3%] rounded-xl md:rounded-2xl overflow-hidden bg-slate-900/95 backdrop-blur-xl`}>
        {/* Glass morphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/80 to-slate-900/95 backdrop-blur-xl border border-emerald-500/10 rounded-xl md:rounded-2xl" />

        {/* Simple background gradient */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-emerald-500 to-teal-500" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Simple Icon */}
          <div className="relative mb-[2%]" style={{ marginBottom: 'clamp(0.75rem, 2%, 1.5rem)' }}>
            <div className="w-[12%] aspect-square max-w-[64px] min-w-[48px] rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center" style={{ width: 'clamp(48px, 12%, 64px)' }}>
              {Icon ? <Icon className="text-white" style={{ width: 'clamp(24px, 50%, 32px)', height: 'clamp(24px, 50%, 32px)' }} /> : null}
            </div>
          </div>

          <h3 className={`text-white mb-[1%] font-semibold`} style={{ 
            fontSize: interactive ? 'clamp(1rem, 4vw, 1.5rem)' : 'clamp(0.875rem, 3vw, 1.125rem)',
            marginBottom: 'clamp(0.5rem, 1%, 0.75rem)',
            lineHeight: '1.2'
          }}>{title}</h3>

          <p className={`text-slate-400 leading-relaxed mb-[1.5%]`} style={{ 
            fontSize: interactive ? 'clamp(0.75rem, 2.5vw, 1rem)' : 'clamp(0.625rem, 2vw, 0.875rem)',
            marginBottom: 'clamp(0.75rem, 1.5%, 1rem)',
            lineHeight: '1.5'
          }}>{description}</p>

          {/* Interactive Demo Section */}
          {interactive && isActive && (
            <div className="mt-[2%] p-[2.5%] bg-slate-800/50 rounded-lg md:rounded-xl border border-emerald-500/20 flex flex-col flex-1 min-h-0" style={{ 
              marginTop: 'clamp(0.75rem, 2%, 1.5rem)',
              padding: 'clamp(0.75rem, 2.5%, 1rem)',
              minHeight: 'clamp(200px, 40%, 250px)'
            }}>
              {type === 'ai-agent' && (
                <div className="flex flex-col h-full min-h-0">
                  <div className="flex items-center gap-2 mb-[2%]" style={{ gap: 'clamp(0.25rem, 1%, 0.5rem)', marginBottom: 'clamp(0.5rem, 2%, 1rem)' }}>
                    <div className="bg-emerald-500 rounded-full animate-pulse" style={{ width: 'clamp(6px, 1.5%, 8px)', height: 'clamp(6px, 1.5%, 8px)' }}></div>
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
                        fontSize: 'clamp(0.625rem, 2vw, 0.875rem)'
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
                        fontSize: 'clamp(0.75rem, 3vw, 1.125rem)'
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
                          console.log('📞 Calling API with phone:', phoneNumber);
                          
                          const response = await fetch('/api/vapi/call', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ phoneNumber }),
                          });

                          console.log('📥 API Response status:', response.status);
                          const data = await response.json();
                          console.log('📥 API Response data:', data);

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
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-95"
                      style={{ 
                        padding: 'clamp(0.5rem, 2.5%, 0.75rem)',
                        fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
                        gap: 'clamp(0.25rem, 1%, 0.5rem)',
                        marginTop: 'clamp(0.5rem, 2%, 0.75rem)'
                      }}
                    >
                      {isCalling ? (
                        <>
                          <div className="border-2 border-white border-t-transparent rounded-full animate-spin" style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }}></div>
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
                          } catch (error) {
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
                            <div className="border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" style={{ width: 'clamp(10px, 2.5vw, 12px)', height: 'clamp(10px, 2.5vw, 12px)' }}></div>
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
                              <div className="bg-emerald-400 rounded-full animate-bounce" style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', animationDelay: '0ms' }}></div>
                              <div className="bg-emerald-400 rounded-full animate-bounce" style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', animationDelay: '150ms' }}></div>
                              <div className="bg-emerald-400 rounded-full animate-bounce" style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', animationDelay: '300ms' }}></div>
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
                        fontSize: 'clamp(0.625rem, 2vw, 0.875rem)'
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
                          } catch (error) {
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
                          } catch (error) {
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
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium flex-shrink-0 flex items-center justify-center"
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
                <div className="flex flex-col h-full min-h-0">
                  <div className="text-center flex-shrink-0" style={{ 
                    marginBottom: 'clamp(0.5rem, 2%, 0.75rem)'
                  }}>
                    <h4 className="text-white font-semibold mb-[0.5%]" style={{ 
                      fontSize: 'clamp(0.875rem, 3.5vw, 1.25rem)',
                      marginBottom: 'clamp(0.25rem, 0.5%, 0.5rem)'
                    }}>n8n Workflow Demo</h4>
                    <p className="text-slate-400 px-2" style={{ 
                      fontSize: 'clamp(0.5rem, 1.5vw, 0.875rem)',
                      paddingLeft: 'clamp(0.25rem, 1%, 0.5rem)',
                      paddingRight: 'clamp(0.25rem, 1%, 0.5rem)'
                    }}>Watch how we connect your apps with visual workflows</p>
                  </div>
                  
                  {/* Visual Workflow Diagram */}
                  <div className="bg-slate-900/70 rounded-lg relative overflow-hidden flex-shrink" style={{ 
                    padding: 'clamp(0.5rem, 2%, 1rem)',
                    minHeight: 'clamp(120px, 30%, 160px)',
                    maxHeight: 'clamp(120px, 50%, 180px)',
                    marginBottom: 'clamp(0.5rem, 1.5%, 0.75rem)',
                    flex: '1 1 auto'
                  }}>
                    <svg viewBox="0 0 300 160" className="w-full h-full" style={{ maxHeight: '100%' }} preserveAspectRatio="xMidYMid meet">
                      {/* Connection lines */}
                      {/* Gmail -> n8n */}
                      <motion.line
                        x1={40}
                        y1={80}
                        x2={120}
                        y2={50}
                        stroke={activeNode >= 1 ? '#10b981' : '#4a5568'}
                        strokeWidth="1.5"
                        strokeDasharray={activeNode >= 1 ? '0' : '4,4'}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: activeNode >= 1 ? 1 : 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* n8n -> Slack */}
                      <motion.line
                        x1={120}
                        y1={50}
                        x2={200}
                        y2={80}
                        stroke={activeNode >= 2 ? '#10b981' : '#4a5568'}
                        strokeWidth="1.5"
                        strokeDasharray={activeNode >= 2 ? '0' : '4,4'}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: activeNode >= 2 ? 1 : 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* n8n -> Notion */}
                      <motion.line
                        x1={120}
                        y1={50}
                        x2={120}
                        y2={110}
                        stroke={activeNode >= 3 ? '#10b981' : '#4a5568'}
                        strokeWidth="1.5"
                        strokeDasharray={activeNode >= 3 ? '0' : '4,4'}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: activeNode >= 3 ? 1 : 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      {/* Workflow Nodes */}
                      {[
                        { id: 0, x: 40, y: 80, label: 'Gmail', color: '#ea4335' },
                        { id: 1, x: 120, y: 50, label: 'n8n', color: '#10b981' },
                        { id: 2, x: 200, y: 80, label: 'Slack', color: '#4a154b' },
                        { id: 3, x: 120, y: 110, label: 'Notion', color: '#000000' },
                      ].map((node, idx) => (
                        <g key={node.id}>
                          {/* Node circle */}
                          <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r="15"
                            fill={activeNode === idx ? node.color : '#374151'}
                            stroke={activeNode === idx ? '#10b981' : '#4a5568'}
                            strokeWidth={activeNode === idx ? '2' : '1.5'}
                            initial={{ scale: 1 }}
                            animate={{ scale: activeNode === idx ? 1.1 : 1 }}
                            transition={{ duration: 0.3 }}
                          />
                          {/* Node label */}
                          <text
                            x={node.x}
                            y={node.y + 25}
                            textAnchor="middle"
                            fill="#e5e7eb"
                            fontSize="9"
                            fontWeight="500"
                            className="select-none"
                          >
                            {node.label}
                          </text>
                          {/* Active pulse effect */}
                          {activeNode === idx && (
                            <motion.circle
                              cx={node.x}
                              cy={node.y}
                              r="15"
                              fill={node.color}
                              opacity="0.3"
                              initial={{ scale: 1, opacity: 0.5 }}
                              animate={{ scale: 1.4, opacity: 0 }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          )}
                        </g>
                      ))}
                    </svg>

                    {/* Auto-play animation indicator */}
                    <div className="absolute bottom-1.5 md:bottom-2 right-1.5 md:right-2 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-emerald-400">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="hidden sm:inline">Workflow Active</span>
                      <span className="sm:hidden">Active</span>
                    </div>
                  </div>

                  {/* Workflow Description */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex-shrink-0 w-full" style={{ 
                    padding: 'clamp(0.375rem, 1.5%, 0.625rem)',
                    marginTop: 'auto',
                    marginBottom: 'clamp(0.5rem, 2%, 0.75rem)'
                  }}>
                    <p className="text-emerald-300 text-center leading-relaxed break-words" style={{ 
                      fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      lineHeight: '1.3'
                    }}>
                      Email triggers → n8n processes → Updates Slack & Notion automatically
                    </p>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>

        {/* Visual Enhancement - Phone Mockup for Voice */}
        {type === 'voice-agent' && isActive && (
          <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full blur-xl"></div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </motion.div>
            </div>
          </div>
        )}

        {/* Visual Enhancement - Chat Bubbles for Chatbot */}
        {type === 'chatbot' && isActive && (
          <div className="absolute top-4 right-4 w-20 h-20 opacity-20">
            <motion.div
              className="w-full h-full flex flex-col gap-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-8 bg-emerald-500 rounded-lg rounded-bl-none ml-auto"></div>
              <div className="w-10 h-8 bg-slate-600 rounded-lg rounded-br-none"></div>
            </motion.div>
          </div>
        )}

        {/* Visual Enhancement - Network Nodes for n8n */}
        {type === 'n8n-automations' && isActive && (
          <div className="absolute top-4 right-4 w-20 h-20 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={50 + Math.cos(i * 2.09) * 20}
                  cy={50 + Math.sin(i * 2.09) * 20}
                  r="8"
                  fill="#10b981"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
              <motion.circle
                cx={50}
                cy={50}
                r="8"
                fill="#10b981"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </svg>
          </div>
        )}

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient}`} />
      </div>
    </div>
  );
}
