# Tech Stack Documentation

Complete list of technologies, frameworks, libraries, and services used in this VAWCOM website.

## 🎯 Core Framework & Runtime

- **Next.js** `16.0.0` - React framework for production
  - Server-side rendering (SSR)
  - API routes
  - Server Actions
  - File-based routing

- **React** `19.2.0` - UI library
- **React DOM** `19.2.0` - React rendering

- **TypeScript** `^5` - Type-safe JavaScript
  - Strict mode enabled
  - ES2017 target
  - Modern module resolution

- **Node.js** - Runtime environment (via Next.js)

## 🎨 Styling & UI

- **Tailwind CSS** `^3.4.3` - Utility-first CSS framework
  - Custom color system with HSL variables
  - Dark mode support
  - Responsive design utilities
  - Custom animations

- **tailwindcss-animate** `^1.0.7` - Animation utilities for Tailwind

- **PostCSS** `^8.4.35` - CSS processing
  - **Autoprefixer** `^10.4.17` - Automatic vendor prefixes
  - **postcss-import** `^16.0.1` - Import CSS files

- **CSS Modules** - Component-scoped styling

## 🧩 UI Components & Libraries

### Radix UI (Headless UI Components)
- **@radix-ui/react-accordion** `^1.2.12` - Accessible accordion component
- **@radix-ui/react-alert-dialog** `^1.1.15` - Alert dialog component
- **@radix-ui/react-aspect-ratio** `^1.1.2` - Aspect ratio container
- **@radix-ui/react-avatar** `^1.1.10` - Avatar component
- **@radix-ui/react-slot** `^1.2.3` - Slot component for composition

### Utility Libraries
- **class-variance-authority** `^0.7.1` - Component variant management
- **clsx** `^2.1.1` - Conditional className utility
- **tailwind-merge** `^2.6.0` - Merge Tailwind classes intelligently

### Icons
- **lucide-react** `^0.548.0` - Icon library
- **react-icons** `^5.5.0` - Popular icon sets

## 🎬 Animation & Effects

- **Framer Motion** `^12.23.24` - Production-ready motion library
  - Page transitions
  - Component animations
  - Gesture handling

- **GSAP** `^3.13.0` - Professional animation library
  - Advanced animations
  - Timeline controls
  - Scroll-triggered animations

- **OGL** `^1.0.11` - Minimal WebGL library
  - 3D graphics and effects

## 📧 Email Services

- **Nodemailer** `^7.0.10` - Email sending library
  - SMTP support
  - Gmail integration
  - HTML email templates

- **Resend** `^6.4.2` - Modern email API
  - Transactional emails
  - API-based email sending
  - Fallback email service

## 🤖 AI & Voice Services

### OpenAI
- **OpenAI API** - GPT-3.5-turbo integration
  - Chatbot functionality
  - Document Q&A
  - Natural language processing

### Vapi (Voice AI Platform)
- **Vapi API** - Voice agent platform
  - AI-powered voice calls
  - Voice assistant creation
  - Phone number management

### Twilio
- **Twilio** - Communication platform
  - Phone number provisioning
  - Voice call handling
  - SMS capabilities (potential)
  - Integration with Vapi

## 🛠️ Development Tools

- **ESLint** `^9` - Code linting
  - **eslint-config-next** `^16.0.0` - Next.js ESLint configuration

- **Babel Plugin React Compiler** `1.0.0` - React compiler optimization

- **Webpack** - Module bundler (via Next.js)

## 📦 Build & Deployment

- **Vercel** (implied) - Deployment platform
  - Serverless functions
  - Edge network
  - Environment variables management

## 🔧 Configuration Files

- **next.config.ts** - Next.js configuration
  - React strict mode
  - Server Actions body size limit (2MB)
  - Production console removal
  - File tracing optimization

- **tsconfig.json** - TypeScript configuration
  - ES2017 target
  - Strict mode
  - Path aliases (@/*)
  - JSX support

- **tailwind.config.js** - Tailwind CSS configuration
  - Custom color palette
  - Dark mode configuration
  - Custom animations
  - Container settings

- **postcss.config.js** - PostCSS configuration
- **eslint.config.mjs** - ESLint configuration

## 🌐 APIs & External Services

### Required Environment Variables
- `OPENAI_API_KEY` - OpenAI API access
- `VAPI_PRIVATE_KEY` or `VAPI_PUBLIC_KEY` - Vapi authentication
- `VAPI_AGENT_ID` - Vapi voice agent ID
- `VAPI_PHONE_NUMBER_ID` - Phone number ID (optional)
- `TWILIO_ACCOUNT_SID` - Twilio account (optional)
- `TWILIO_AUTH_TOKEN` - Twilio authentication (optional)
- `TWILIO_PHONE_NUMBER` - Twilio phone number (optional)

### Email Configuration (Optional)
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - From email address
- `RESEND_API_KEY` - Resend API key (fallback)
- `RESEND_FROM_EMAIL` - Resend from email
- `CONTACT_EMAIL` - Recipient email for contact form

## 📁 Project Structure

```
tech-startup/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chatbot/       # Chatbot endpoints
│   │   ├── contact/       # Contact form endpoint
│   │   └── vapi/          # Vapi voice call endpoint
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   └── [Component].tsx    # Feature components
├── lib/                   # Utility libraries
│   ├── documentStore.ts   # Document storage
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

## 🎯 Key Features Implemented

1. **Responsive Web Design** - Mobile-first approach with Tailwind CSS
2. **AI Chatbot** - OpenAI-powered with fallback to predefined responses
3. **Voice Agent Integration** - Vapi-powered voice calling
4. **Contact Form** - Email integration (SMTP/Resend)
5. **Document Upload & Q&A** - Document analysis with AI
6. **Animations** - Framer Motion and GSAP for smooth interactions
7. **Dark Mode** - Tailwind-based dark theme support
8. **Server-Side Rendering** - Next.js SSR for SEO and performance

## 🚀 Performance Optimizations

- React strict mode enabled
- Console removal in production
- Server Actions body size optimization
- File tracing for deployment
- Code splitting via Next.js
- Image optimization (Next.js Image component)

## 📝 Notes

- The project uses Next.js 16 with React 19
- TypeScript is configured with strict mode
- All UI components are built with Radix UI primitives
- Email service supports multiple providers (SMTP primary, Resend fallback)
- Voice calling supports multiple configurations (Vapi default, Twilio integration)
- Chatbot works with or without OpenAI API key (predefined responses fallback)

---

**Last Updated**: Based on current codebase analysis
**Project**: VAWCOM Tech Startup Website


