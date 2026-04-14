import { NextRequest, NextResponse } from 'next/server';
import { getDocumentText, setDocumentText } from '@/lib/documentStore';
import { CONTACT_EMAIL, SOCIAL } from '@/lib/site';

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
      : `You are a helpful AI assistant for VAWCOM, a full-service digital studio. We deliver web and mobile applications, voice experiences, AI chatbots, integrations, and related engineering support.

Answer questions clearly and concisely. You can help with:
- Questions about VAWCOM's services (web, mobile, voice, AI/chat, integrations)
- General technical questions
- Information about tools we use (e.g. n8n, Vapi) when relevant
- General assistance and conversation

Be friendly, professional, and helpful.`;

    // Get API keys from environment variables
    // Priority: Gemini > OpenAI > Predefined responses
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // Try Gemini API first (if available)
    if (GEMINI_API_KEY && GEMINI_API_KEY.trim()) {
      try {
        console.log('🤖 Calling Google Gemini API...');
        console.log('📝 Message:', message);
        console.log('🔑 Gemini API Key present:', GEMINI_API_KEY.substring(0, 10) + '...');
        
        // Prepare the prompt with context
        const fullPrompt = storedContext 
          ? `${context}\n\nUser question: ${message}`
          : `${context}\n\nUser: ${message}\n\nAssistant:`;
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY.trim()}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: fullPrompt
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              }
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const geminiResponse = data.candidates[0].content.parts[0].text;
          console.log('✅ Gemini response received:', geminiResponse.substring(0, 100));
          return NextResponse.json({
            response: geminiResponse,
            hasContext: !!storedContext,
          });
        } else {
          console.error('❌ Gemini API error response:', {
            status: response.status,
            statusText: response.statusText,
            data: data
          });
          // Fall through to OpenAI or predefined responses
        }
      } catch (error) {
        console.error('❌ Gemini API request error:', error);
        // Fall through to OpenAI or predefined responses
      }
    }

    // Try OpenAI API as fallback (if available)
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
      // No API keys - use predefined responses
      console.log('⚠️ No Gemini or OpenAI API key found. Using predefined responses.');
      
      // If there's document context, use smart response
      if (storedContext) {
        return NextResponse.json({
          response: generateSmartResponse(message, storedContext),
          hasContext: true,
        });
      }
      
      // Otherwise use default predefined responses
      return NextResponse.json({
        response: generateDefaultResponse(message),
        hasContext: false,
      });
    }

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
  const lowerMessage = message.toLowerCase().trim();
  
  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/)) {
    return 'Hello! 👋 Welcome to VAWCOM! I\'m here to help you learn about our services. How can I assist you today?';
  }
  
  // Asking for user info or introduction
  if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you') || lowerMessage.includes('introduce')) {
    return 'I\'m an AI assistant for VAWCOM, a full-service digital studio. I can help you learn about our work: web and mobile apps, voice products, AI chat experiences, integrations, and more. What would you like to know?';
  }
  
  // Company information
  if (lowerMessage.includes('company') || lowerMessage.includes('about') || lowerMessage.includes('vawcom')) {
    return 'VAWCOM is a full-service digital studio. We offer:\n\n• Web development\n• Mobile app development\n• Voice experiences (e.g. Vapi)\n• AI chatbots\n• Integrations & orchestration (e.g. n8n)\n\nWhat are you looking to build?';
  }
  
  // Services
  if (lowerMessage.includes('service') || lowerMessage.includes('what do you offer') || lowerMessage.includes('what can you do')) {
    return 'We offer end-to-end digital services:\n\n🌐 **Web** — Sites and web apps\n📱 **Mobile** — iOS, Android, cross-platform\n🎙️ **Voice** — Voice products and telephony integrations\n💬 **AI chat** — Assistants for support and engagement\n🔗 **Integrations** — APIs, data sync, orchestration (e.g. n8n)\n\nWhich area should we dive into?';
  }
  
  // Contact information
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('reach') || lowerMessage.includes('get in touch')) {
    return `To get in touch with VAWCOM:\n\n📧 Email: ${CONTACT_EMAIL} (tap email links on our site to open Gmail compose)\n📸 Instagram: ${SOCIAL.instagram}\n🔗 LinkedIn: ${SOCIAL.linkedin}\n🌐 Website: https://www.vawcom.com\n\nYou can also use the Contact form on our site.`;
  }
  
  // Pricing
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('pricing')) {
    return 'Our pricing varies based on project scope and requirements. We offer customized solutions tailored to your needs. Would you like to schedule a consultation to discuss your specific project? I can help you get in touch with our team!';
  }
  
  // Web development
  if (lowerMessage.includes('web') || lowerMessage.includes('website') || lowerMessage.includes('web development')) {
    return 'We build modern, responsive websites and web applications using the latest technologies. Our web development services include:\n\n• Custom website design\n• E-commerce solutions\n• Web applications\n• API development\n• Performance optimization\n\nTell me more about your web project needs!';
  }
  
  // Mobile apps
  if (lowerMessage.includes('mobile') || lowerMessage.includes('app') || lowerMessage.includes('ios') || lowerMessage.includes('android')) {
    return 'We develop native and cross-platform mobile applications for iOS and Android. Our mobile app services include:\n\n• Native iOS development\n• Native Android development\n• Cross-platform solutions\n• App design and UX\n• App store optimization\n\nWhat type of mobile app are you looking to build?';
  }
  
  // Voice agents
  if (lowerMessage.includes('voice') || lowerMessage.includes('vapi') || lowerMessage.includes('voice agent')) {
    return 'We create intelligent voice agents using Vapi technology. Our voice agent solutions can:\n\n• Handle customer calls automatically\n• Provide 24/7 support\n• Integrate with your systems\n• Support multiple languages\n• Scale with your business\n\nInterested in implementing a voice agent for your business?';
  }
  
  // Chatbots
  if (lowerMessage.includes('chatbot') || lowerMessage.includes('chat bot')) {
    return 'We build intelligent chatbots that can:\n\n• Answer customer questions\n• Handle support requests\n• Qualify leads\n• Schedule appointments\n• Integrate with your CRM\n\nThey’re built to match your tone and workflows. Want to learn more?';
  }
  
  // n8n automations
  if (lowerMessage.includes('n8n') || lowerMessage.includes('automation') || lowerMessage.includes('workflow')) {
    return 'We use n8n and similar tools when your product needs reliable orchestration—connecting CRMs, messaging, email, databases, and custom APIs. It’s one part of our broader integration and backend work.\n\nWhat systems are you trying to connect?';
  }
  
  // Portfolio or examples
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('example') || lowerMessage.includes('work') || lowerMessage.includes('project')) {
    return 'We\'ve shipped web and mobile products, voice and chat experiences, and integration-heavy builds across different industries. For concrete examples, our team can walk you through case studies that match your use case.';
  }
  
  // Timeline or duration
  if (lowerMessage.includes('how long') || lowerMessage.includes('timeline') || lowerMessage.includes('duration') || lowerMessage.includes('when')) {
    return 'Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while a complex mobile app could take 3-6 months. We\'ll provide a detailed timeline after understanding your specific requirements. Would you like to discuss your project timeline?';
  }
  
  // Technology stack
  if (lowerMessage.includes('technology') || lowerMessage.includes('tech stack') || lowerMessage.includes('what technology') || lowerMessage.includes('stack')) {
    return 'We use modern technologies and tools:\n\n• **Web**: React, Next.js, Node.js, TypeScript\n• **Mobile**: React Native, Swift, Kotlin\n• **Voice**: Vapi, Twilio\n• **Integrations & orchestration**: n8n, Zapier, custom APIs\n• **Cloud**: AWS, Vercel, and more\n\nWe pick the right stack per project. What are you leaning toward?';
  }
  
  // Help
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you help')) {
    return 'I can help you with:\n\n✅ VAWCOM services (web, mobile, voice, AI, integrations)\n✅ Contact and next steps\n✅ General questions\n\nYou can also upload a document and I\'ll answer questions about it. What would you like to know?';
  }
  
  // Upload/document questions
  if (lowerMessage.includes('upload') || lowerMessage.includes('document') || lowerMessage.includes('file')) {
    return 'Yes! You can upload documents (PDF, TXT, or DOC) using the upload feature. Once uploaded, I can answer questions based on the document content. Try uploading a document and ask me about it!';
  }
  
  // Thank you
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return 'You\'re welcome! 😊 Is there anything else I can help you with? Feel free to ask about our services or upload a document!';
  }
  
  // Goodbye
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you') || lowerMessage.includes('later')) {
    return 'Goodbye! 👋 Thanks for visiting VAWCOM. Feel free to come back anytime if you have more questions. Have a great day!';
  }
  
  // Default response for unmatched queries
  return 'I\'m here to help you learn about VAWCOM. Ask about our services (web, mobile, voice, AI, integrations), the company, contact options, tech stack, or timelines—or say hi to get started.';
}


