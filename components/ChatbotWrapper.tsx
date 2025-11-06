'use client';

import dynamic from 'next/dynamic';

const Chatbot = dynamic(
  () => import('./Chatbot'),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed bottom-8 right-8 z-50">
        <button className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white shadow-lg">
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
            className="w-8 h-8 animate-pulse"
          >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
          </svg>
        </button>
      </div>
    )
  }
);

export default function ChatbotWrapper() {
  return <Chatbot />;
}
