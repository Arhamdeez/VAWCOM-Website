import { NextRequest, NextResponse } from 'next/server';
import { getDocumentText, setDocumentText } from '@/lib/documentStore';

export async function POST(request: NextRequest) {
  try {
    const { message, documentText, sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // If document text is provided, store it for this session
    if (documentText && sessionId) {
      setDocumentText(sessionId, documentText);
    }

    // Get stored document context for this session
    const storedContext = getDocumentText(sessionId || 'default');

    // Prepare the context for AI
    const context = storedContext 
      ? `You are a helpful AI assistant. The user has uploaded a document. Use the following document content to answer their questions:\n\n${storedContext}\n\nInstructions:
- Answer questions using information from the document when possible
- If the answer isn't in the document, politely say so and offer to help with what you can
- Be concise but thorough
- If asked for a summary, provide a clear overview of the document's main points`
      : `You are a helpful AI assistant for VAWCOM, a company specializing in automation-first digital solutions including web development, mobile apps, voice agents, chatbots, and n8n automations. 

Answer questions clearly and concisely. You can help with:
- Questions about VAWCOM's services (web, mobile, voice, chatbot, automation)
- General technical questions
- Information about n8n, Vapi, and other technologies we use
- General assistance and conversation

Be friendly, professional, and helpful.`;

    // Get OpenAI API key from environment variables (REQUIRED - no hardcoded fallbacks)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (OPENAI_API_KEY && OPENAI_API_KEY.trim()) {
      try {
        console.log('🤖 Calling OpenAI API...');
        console.log('📝 Message:', message);
        console.log('🔑 API Key present:', OPENAI_API_KEY.substring(0, 10) + '...');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY.trim()}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: context,
              },
              {
                role: 'user',
                content: message,
              },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        const data = await response.json();

        if (response.ok && data.choices?.[0]?.message?.content) {
          console.log('✅ OpenAI response received:', data.choices[0].message.content.substring(0, 100));
          return NextResponse.json({
            response: data.choices[0].message.content,
            hasContext: !!storedContext,
          });
        } else {
          console.error('❌ OpenAI API error response:', {
            status: response.status,
            statusText: response.statusText,
            data: data
          });
          // Return error message to user instead of falling back
          return NextResponse.json({
            response: `I apologize, but I'm having trouble connecting to the AI service. Error: ${data.error?.message || 'Unknown error'}. Please try again.`,
            hasContext: !!storedContext,
          });
        }
      } catch (error) {
        console.error('❌ OpenAI API request error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Return error message to user
        return NextResponse.json({
          response: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
          hasContext: !!storedContext,
        });
      }
    } else {
      console.error('❌ Missing OpenAI API key. Please set OPENAI_API_KEY in .env.local');
      return NextResponse.json(
        {
          error: 'Configuration error',
          response: 'The chatbot service is not properly configured. Please contact support.',
        },
        { status: 500 }
      );
    }

    // Fallback: Smart response based on document context
    if (storedContext) {
      return NextResponse.json({
        response: generateSmartResponse(message, storedContext),
        hasContext: true,
      });
    }

    // Default response when no document is uploaded
    return NextResponse.json({
      response: generateDefaultResponse(message),
      hasContext: false,
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', response: 'I apologize, but I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}

function generateSmartResponse(message: string, context: string): string {
  const lowerMessage = message.toLowerCase();
  const lowerContext = context.toLowerCase();
  
  // Extract keywords from user message
  const questionWords = lowerMessage.split(/\s+/).filter(w => w.length > 3);
  
  // Find relevant sentences from context
  const sentences = context.split(/[.!?\n]+/).filter(s => s.trim().length > 10);
  
  // Find sentences that contain question keywords
  const relevantSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return questionWords.some(word => lowerSentence.includes(word));
  });
  
  // If we found relevant content
  if (relevantSentences.length > 0) {
    const answer = relevantSentences.slice(0, 3).join('. ').trim();
    return answer.substring(0, 400) + (answer.length > 400 ? '...' : '');
  }
  
  // Handle specific question types
  if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
    const summary = sentences.slice(0, 4).join('. ').trim();
    return `Summary: ${summary.substring(0, 300)}${summary.length > 300 ? '...' : ''}`;
  }
  
  if (lowerMessage.includes('what') && (lowerMessage.includes('about') || lowerMessage.includes('contain'))) {
    const firstParagraph = sentences.slice(0, 3).join('. ').trim();
    return `Based on the document: ${firstParagraph.substring(0, 250)}${firstParagraph.length > 250 ? '...' : ''}`;
  }
  
  if (lowerMessage.includes('key point') || lowerMessage.includes('important') || lowerMessage.includes('main')) {
    const keyPoints = sentences.filter((s, i) => i % 2 === 0).slice(0, 3);
    return `Key points from the document:\n${keyPoints.map((p, i) => `${i + 1}. ${p.trim()}`).join('\n')}`.substring(0, 350);
  }
  
  // Default: show that we have the document and can answer questions
  const preview = sentences.slice(0, 2).join('. ').trim().substring(0, 150);
  return `I have access to your document. ${preview}...\n\nWhat specific information would you like to know about it?`;
}

function generateDefaultResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! I\'m your AI assistant. Upload a document to get started, or ask me anything!';
  }
  
  if (lowerMessage.includes('help')) {
    return 'I can help you with questions about uploaded documents. Try uploading a document (PDF, TXT, or DOC) and then ask me questions about it!';
  }
  
  if (lowerMessage.includes('upload') || lowerMessage.includes('document')) {
    return 'Yes! You can upload documents using the "Upload Document" button above. I\'ll analyze them and answer questions based on their content.';
  }
  
  return 'I\'m here to help! Upload a document to get started, or ask me a general question.';
}


