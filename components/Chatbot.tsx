'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

// Predefined responses
const RESPONSES: Record<string, string> = {
  'hi': 'Hello! How can I help you today?',
  'hello': 'Hi there! What can I do for you?',
  'how are you': 'I\'m just a bot, but I\'m here to help!',
  'what can you do': 'I can answer basic questions about our services. Try asking about our offerings!',
  'services': 'We offer web development, mobile app development, and digital marketing services. What would you like to know more about?',
  'contact': 'You can reach us at contact@techstartup.com or call us at (123) 456-7890.',
  'thanks': 'You\'re welcome! Is there anything else I can help with?',
  'bye': 'Goodbye! Have a great day!',
};

// Default response if no match is found
const DEFAULT_RESPONSE = "I'm not sure how to respond to that. Could you try asking something else?";

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: 'Hello! How can I help you today?',
          sender: 'bot'
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Get bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input.toLowerCase());
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const getBotResponse = (userInput: string): string => {
    // Check for exact matches first
    if (RESPONSES[userInput]) {
      return RESPONSES[userInput];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(RESPONSES)) {
      if (userInput.includes(key)) {
        return value;
      }
    }

    return DEFAULT_RESPONSE;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-[400px] flex flex-col bg-[#1E1E1E] rounded-lg shadow-xl border border-gray-700 overflow-hidden" style={{ height: '700px' }}>
          {/* Header */}
          <div className="bg-[#1E1E1E] p-4 border-b border-gray-700 flex justify-between items-center">
            <button 
              className="text-white hover:bg-gray-700 p-1 rounded"
              onClick={() => setMessages([])}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
            </button>
            <h3 className="text-white font-medium">New Chat</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#1E1E1E]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-[#2D7FF9] text-white rounded-tr-none' 
                        : 'bg-[#2D2D2D] text-white rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-3 text-center text-xs text-gray-400 border-t border-gray-700">
            AI can make mistakes. Consider checking important information.
          </div>
          
          {/* Input */}
          <div className="p-4 bg-[#1E1E1E] border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message"
                  className="w-full bg-[#2D2D2D] text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-2"
                  aria-label="Send message"
                  disabled={!input.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
                    <path d="m3 3 3 9-3 9 19-9Z"/>
                    <path d="M6 12h16"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2D7FF9] text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
