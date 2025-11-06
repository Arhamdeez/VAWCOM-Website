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
      <div className={`relative w-full h-full min-h-[400px] p-8 rounded-2xl overflow-hidden bg-slate-900/95 backdrop-blur-xl`}>
        {/* Glass morphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/80 to-slate-900/95 backdrop-blur-xl border border-emerald-500/10" />

        {/* Simple background gradient */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-emerald-500 to-teal-500" />

        {/* Content */}
        <div className="relative z-10">
          {/* Simple Icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              {Icon ? <Icon className="w-8 h-8 text-white" /> : null}
            </div>
          </div>

          <h3 className={`text-white mb-3 ${interactive ? 'text-2xl' : 'text-lg'} font-semibold`}>{title}</h3>

          <p className={`text-slate-400 leading-relaxed ${interactive ? 'text-base' : 'text-sm'} mb-4`}>{description}</p>

          {/* Interactive Demo Section */}
          {interactive && isActive && (
            <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-emerald-500/20 h-[250px] flex flex-col">
              {type === 'ai-agent' && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-medium">Live Demo</span>
                  </div>
                  
                  {/* Chat Interface */}
                  <div className="bg-slate-900/50 rounded-lg p-4 flex-1 overflow-y-auto space-y-3" style={{ maxHeight: '120px' }}>
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-700 text-slate-200'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Input */}
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
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
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
              </div>
              )}

              {type === 'voice-agent' && (
                <div className="space-y-5 flex-1 flex flex-col justify-center">
                  <div className="text-center space-y-3">
                    <h4 className="text-white text-xl font-semibold">Try Our Voice Agent</h4>
                    <p className="text-slate-400 text-sm">Enter your phone number to receive a demo call from our AI voice agent</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setCallStatus({ type: null, message: '' });
                      }}
                      placeholder="+1 (217) 555-1234"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isCalling}
                    />
                    <p className="text-xs text-slate-500 text-center">
                      Enter a US phone number (+1) to receive the call
                    </p>
                    
                    {callStatus.type && (
                      <div className={`p-3 rounded-lg text-sm whitespace-pre-line ${
                        callStatus.type === 'success' 
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/20 border border-red-500/30 text-red-300'
                      }`}>
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
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300"
                    >
                      {isCalling ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Initiating Call...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="text-center mb-3">
                    <h4 className="text-white text-xl font-semibold mb-1">AI Chatbot with Document Q&A</h4>
                    <p className="text-slate-400 text-xs">Upload documents and ask questions about them</p>
                  </div>

                  {/* Document Upload Section */}
                  <div className="mb-3 flex gap-2 flex-shrink-0">
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
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                        isUploading
                          ? 'border-emerald-500 bg-emerald-500/10 cursor-wait'
                          : 'border-slate-600 hover:border-emerald-500/50 bg-slate-800/50'
                      }`}>
                        {isUploading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-emerald-400">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-xs text-slate-300 truncate">
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
                        className="px-3 py-2 text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg border border-red-500/30 transition-colors flex-shrink-0"
                        title="Clear document"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Chat History */}
                  <div 
                    ref={chatHistoryRef}
                    className="bg-slate-900/50 rounded-lg p-3 flex-1 overflow-y-auto mb-3 min-h-0 scroll-smooth" 
                    style={{ maxHeight: '350px' }}
                  >
                    <div className="space-y-2">
                      {botHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-2 rounded-lg text-xs ${
                            msg.type === 'user' 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-700 text-slate-200'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-slate-700 text-slate-200 p-2 rounded-lg">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2 flex-shrink-0">
                    <input
                      type="text"
                      value={botMessage}
                      onChange={(e) => setBotMessage(e.target.value)}
                      placeholder={uploadedFile ? "Ask about your document..." : "Ask me anything..."}
                      className="flex-1 px-3 py-2.5 text-sm bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
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
                      className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium flex-shrink-0"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {type === 'n8n-automations' && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-4">
                    <h4 className="text-white text-xl font-semibold mb-2">n8n Workflow Demo</h4>
                    <p className="text-slate-400 text-sm">Watch how we connect your apps with visual workflows</p>
                  </div>
                  
                  {/* Visual Workflow Diagram */}
                  <div className="flex-1 bg-slate-900/70 rounded-lg p-4 relative overflow-hidden">
                    <svg viewBox="0 0 400 200" className="w-full h-full">
                      {/* Connection lines */}
                      {/* Gmail -> n8n */}
                      <motion.line
                        x1={50}
                        y1={100}
                        x2={150}
                        y2={60}
                        stroke={activeNode >= 1 ? '#10b981' : '#4a5568'}
                        strokeWidth="2"
                        strokeDasharray={activeNode >= 1 ? '0' : '5,5'}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: activeNode >= 1 ? 1 : 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* n8n -> Slack */}
                      <motion.line
                        x1={150}
                        y1={60}
                        x2={250}
                        y2={100}
                        stroke={activeNode >= 2 ? '#10b981' : '#4a5568'}
                        strokeWidth="2"
                        strokeDasharray={activeNode >= 2 ? '0' : '5,5'}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: activeNode >= 2 ? 1 : 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* n8n -> Notion */}
                      <motion.line
                        x1={150}
                        y1={60}
                        x2={150}
                        y2={140}
                        stroke={activeNode >= 3 ? '#10b981' : '#4a5568'}
                        strokeWidth="2"
                        strokeDasharray={activeNode >= 3 ? '0' : '5,5'}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: activeNode >= 3 ? 1 : 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      {/* Workflow Nodes */}
                      {[
                        { id: 0, x: 50, y: 100, label: 'Gmail', color: '#ea4335' },
                        { id: 1, x: 150, y: 60, label: 'n8n', color: '#10b981' },
                        { id: 2, x: 250, y: 100, label: 'Slack', color: '#4a154b' },
                        { id: 3, x: 150, y: 140, label: 'Notion', color: '#000000' },
                      ].map((node, idx) => (
                        <g key={node.id}>
                          {/* Node circle */}
                          <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r="25"
                            fill={activeNode === idx ? node.color : '#374151'}
                            stroke={activeNode === idx ? '#10b981' : '#4a5568'}
                            strokeWidth={activeNode === idx ? '3' : '2'}
                            initial={{ scale: 1 }}
                            animate={{ scale: activeNode === idx ? 1.1 : 1 }}
                            transition={{ duration: 0.3 }}
                          />
                          {/* Node label */}
                          <text
                            x={node.x}
                            y={node.y + 40}
                            textAnchor="middle"
                            fill="#e5e7eb"
                            fontSize="12"
                            fontWeight="500"
                          >
                            {node.label}
                          </text>
                          {/* Active pulse effect */}
                          {activeNode === idx && (
                            <motion.circle
                              cx={node.x}
                              cy={node.y}
                              r="25"
                              fill={node.color}
                              opacity="0.3"
                              initial={{ scale: 1, opacity: 0.5 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          )}
                        </g>
                      ))}
                    </svg>

                    {/* Auto-play animation indicator */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs text-emerald-400">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>Workflow Active</span>
                    </div>
                  </div>

                  {/* Workflow Description */}
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-emerald-300 text-xs text-center">
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
