import { NextRequest, NextResponse } from 'next/server';
import { getDocumentText, setDocumentText } from '@/lib/documentStore';
import { generateGeminiReply } from '@/lib/gemini';
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
    const styleRules = `Style (always): Reply in a direct, minimal tone. Prefer 1–3 short sentences unless the user asks for detail, a list, or a summary. No filler (“I’d be happy to”, “Feel free to”, long intros/outros). No emojis unless the user uses them. Use short bullets only when listing multiple items.`;

    const context = storedContext 
      ? `You answer questions about an uploaded document.\n\nDocument:\n${storedContext}\n\n${styleRules}\nRules: Use the document when it applies. If it doesn’t contain the answer, say so in one brief sentence. Summaries: at most 5 tight bullets unless asked for more.`
      : `You are VAWCOM’s site assistant. VAWCOM is a digital studio: web/mobile apps, voice products, AI chat, integrations, and related engineering.\n\n${styleRules}\nTopics: our services, tools (e.g. n8n, Vapi), light technical Q&A, and next steps to contact. Stay factual and brief.`;

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    let lastGeminiError: string | null = null;

    // Gemini (Google AI) — @google/generative-ai SDK, model from GEMINI_MODEL or default in lib/gemini.ts
    if (geminiKey) {
      const gemini = await generateGeminiReply({
        systemInstruction: context,
        userMessage: message,
      });
      if (gemini.ok) {
        return NextResponse.json({
          response: gemini.text,
          hasContext: !!storedContext,
        });
      }
      lastGeminiError = gemini.error;
      console.error('Gemini error:', gemini.error);
    }

    // OpenAI fallback (if configured)
    if (openAiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
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
            max_tokens: 400,
            temperature: 0.45,
          }),
        });

        const data = await response.json();

        if (response.ok && data.choices?.[0]?.message?.content) {
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
            response: `AI unavailable: ${data.error?.message || 'unknown error'}. Retry or check your API key.`,
            hasContext: !!storedContext,
          });
        }
      } catch (error) {
        console.error('❌ OpenAI API request error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Return error message to user
        return NextResponse.json({
          response: `Request failed: ${errorMessage}. Try again.`,
          hasContext: !!storedContext,
        });
      }
    }

    // No provider keys — offline canned replies only when neither env var is set
    if (!geminiKey && !openAiKey) {
      console.warn(
        '⚠️ No Gemini or OpenAI API key found. Using predefined responses. (Set GEMINI_API_KEY in .env — .env.local empty values override .env.)',
      );

      if (storedContext) {
        return NextResponse.json({
          response: generateSmartResponse(message, storedContext),
          hasContext: true,
        });
      }

      return NextResponse.json({
        response: generateDefaultResponse(message),
        hasContext: false,
      });
    }

    // Keys were set but every configured provider failed (e.g. Gemini error and no OpenAI)
    return NextResponse.json({
      response: lastGeminiError
        ? `AI error: ${lastGeminiError.length > 180 ? `${lastGeminiError.slice(0, 180)}…` : lastGeminiError}`
        : 'No response from the AI. Retry.',
      hasContext: !!storedContext,
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', response: 'Something went wrong. Try again.' },
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
    const answer = relevantSentences.slice(0, 2).join('. ').trim();
    return answer.substring(0, 280) + (answer.length > 280 ? '…' : '');
  }
  
  // Handle specific question types
  if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
    const summary = sentences.slice(0, 3).join('. ').trim();
    return `${summary.substring(0, 220)}${summary.length > 220 ? '…' : ''}`;
  }
  
  if (lowerMessage.includes('what') && (lowerMessage.includes('about') || lowerMessage.includes('contain'))) {
    const firstParagraph = sentences.slice(0, 2).join('. ').trim();
    return `${firstParagraph.substring(0, 200)}${firstParagraph.length > 200 ? '…' : ''}`;
  }
  
  if (lowerMessage.includes('key point') || lowerMessage.includes('important') || lowerMessage.includes('main')) {
    const keyPoints = sentences.filter((s, i) => i % 2 === 0).slice(0, 3);
    return keyPoints.map((p, i) => `${i + 1}. ${p.trim()}`).join('\n').substring(0, 280);
  }
  
  const preview = sentences.slice(0, 1).join('. ').trim().substring(0, 120);
  return preview ? `${preview}… Ask a specific question if you need more.` : 'Upload is loaded. Ask a question about the document.';
}

function generateDefaultResponse(message: string): string {
  const lowerMessage = message.toLowerCase().trim();
  
  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/)) {
    return 'Hi. I can answer questions about VAWCOM’s services or point you to contact options. What do you need?';
  }
  
  // Asking for user info or introduction
  if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you') || lowerMessage.includes('introduce')) {
    return 'I’m the VAWCOM site assistant: web/mobile, voice, AI chat, integrations. What should we cover?';
  }
  
  // Company information
  if (lowerMessage.includes('company') || lowerMessage.includes('about') || lowerMessage.includes('vawcom')) {
    return 'VAWCOM builds web and mobile apps, voice experiences, AI chat, and integrations (e.g. n8n, APIs). What are you trying to ship?';
  }
  
  // Services
  if (lowerMessage.includes('service') || lowerMessage.includes('what do you offer') || lowerMessage.includes('what can you do')) {
    return 'Web & mobile apps, voice (e.g. Vapi), AI assistants, and integrations/orchestration. Which one matters most for you?';
  }
  
  // Contact information
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('reach') || lowerMessage.includes('get in touch')) {
    return `Email: ${CONTACT_EMAIL}. Instagram: ${SOCIAL.instagram}. LinkedIn: ${SOCIAL.linkedin}. Site: https://www.vawcom.com — or use the Contact page.`;
  }
  
  // Pricing
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('pricing')) {
    return 'Pricing depends on scope. Use Contact with your requirements and we’ll quote.';
  }
  
  // Web development
  if (lowerMessage.includes('web') || lowerMessage.includes('website') || lowerMessage.includes('web development')) {
    return 'We build sites and web apps: UI, APIs, performance. Describe the product or page you need.';
  }
  
  // Mobile apps
  if (lowerMessage.includes('mobile') || lowerMessage.includes('app') || lowerMessage.includes('ios') || lowerMessage.includes('android')) {
    return 'Native and cross-platform mobile (iOS/Android). What platform and core features?';
  }
  
  // Voice agents
  if (lowerMessage.includes('voice') || lowerMessage.includes('vapi') || lowerMessage.includes('voice agent')) {
    return 'We ship voice agents with Vapi/Twilio-style stacks: calls, routing, integrations. What’s the use case?';
  }
  
  // Chatbots
  if (lowerMessage.includes('chatbot') || lowerMessage.includes('chat bot')) {
    return 'We build support/sales chatbots with your tone and CRM/API hooks. What should it handle?';
  }
  
  // n8n automations
  if (lowerMessage.includes('n8n') || lowerMessage.includes('automation') || lowerMessage.includes('workflow')) {
    return 'We use n8n to wire CRMs, email, DBs, and APIs. Which systems need to talk?';
  }
  
  // Portfolio or examples
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('example') || lowerMessage.includes('work') || lowerMessage.includes('project')) {
    return 'We can walk through relevant work on a call—tell us your industry and product type.';
  }
  
  // Timeline or duration
  if (lowerMessage.includes('how long') || lowerMessage.includes('timeline') || lowerMessage.includes('duration') || lowerMessage.includes('when')) {
    return 'Rough guide: small sites weeks; larger apps months. Exact timeline after scope. Share what you’re building.';
  }
  
  // Technology stack
  if (lowerMessage.includes('technology') || lowerMessage.includes('tech stack') || lowerMessage.includes('what technology') || lowerMessage.includes('stack')) {
    return 'Typical: React/Next, TypeScript, Node; mobile React Native/Swift/Kotlin; voice Vapi/Twilio; orchestration n8n. Stack is chosen per project.';
  }
  
  // Help
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you help')) {
    return 'Services, contact, tech questions, or upload a doc for Q&A. What do you want?';
  }
  
  // Upload/document questions
  if (lowerMessage.includes('upload') || lowerMessage.includes('document') || lowerMessage.includes('file')) {
    return 'Upload PDF/TXT/DOC here; I’ll answer from the text. Ask something specific after upload.';
  }
  
  // Thank you
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return 'Welcome. Anything else?';
  }
  
  // Goodbye
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you') || lowerMessage.includes('later')) {
    return 'Thanks for stopping by. Reach out via Contact if you want to talk.';
  }
  
  // Default response for unmatched queries
  return 'Ask about services (web, mobile, voice, AI, integrations), contact, or upload a document for questions.';
}


