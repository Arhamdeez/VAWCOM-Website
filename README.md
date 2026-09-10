# VAWCOM Website

Next.js marketing site for VAWCOM (web, mobile, voice, AI).

**This README is the only project doc.** Stack, env, and deploy notes live here — do not add parallel `TECH_STACK` / `DEPLOYMENT` / palette markdown files.

## Run locally

```bash
npm install
npm run dev      # next dev --webpack
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # next build --webpack
npm run start
npm run lint
```

Requires **Node ≥ 20.9.0**.

## Stack (from `package.json`)

| Area | Used |
|------|------|
| App | Next.js `16.2.3`, React `19.2`, TypeScript |
| Style | Tailwind `3.4`, PostCSS, Autoprefixer |
| Motion / 3D | Framer Motion, `three` (hero bot) |
| Icons | `lucide-react` (+ a few custom SVGs in `SocialIcons`) |
| Chat | **OpenRouter** free models (prod) or local **Ollama** (dev) — lexical RAG + intent + safety nets |
| Contact mail | Nodemailer SMTP first, then Resend if SMTP fails |
| Fonts | Plus Jakarta Sans + Pangram Black (`public/fonts/`) |

Brand colors live in CSS (`app/globals.css`, `components/home/home.css`) — cream `#f5f3ee`, brand green `#0cb78b`, glass shell `#050a14`.

## Chatbot (intent + OpenRouter / Ollama RAG)

Flow: **classify intent** → **local greeting only** → otherwise **LLM** with a shared professional prompt + intent addendum + retrieval context. If the LLM is down or rate-limited, **offline fallback** templates answer.

**Production (Vercel, $0):** set `OPENROUTER_API_KEY` (default `openrouter/free`, with a $0 price cap). If the LLM is down, chat uses local templates — never provider error text. No VPS required.

**Local dev:** omit the OpenRouter key and run [Ollama](https://ollama.com) (`ollama pull llama3.2`), or set both and prefer OpenRouter with `CHAT_PROVIDER=openrouter`.

Intent / lexical RAG / safety nets / `npm run test:chatbot` are unchanged — only the generator swaps.

1. Copy `.env.example` → `.env.local`
2. Add `OPENROUTER_API_KEY=...` (and optionally pin `OPENROUTER_MODEL=...:free`)
3. On Vercel: add the same env vars in Project Settings
4. `npm run dev`

**Regression checks (no LLM required):**

```bash
npm run test:chatbot
```

Add a fixture in `scripts/chatbot-eval.ts` when a live transcript breaks.

API returns `{ response, meta }` with `provider` (`openrouter` | `ollama` | `local`), `intent`, model, chunk ids, and latency.

## Environment

| Variable | Role |
|----------|------|
| `OPENROUTER_API_KEY` | Prefer OpenRouter free models on Vercel |
| `OPENROUTER_MODEL` | Default `openrouter/free` (paid slugs coerced to `:free`) |
| `CHAT_PROVIDER` | Force `openrouter` or `ollama` |
| `OLLAMA_BASE_URL` | Default `http://127.0.0.1:11434` (local) |
| `OLLAMA_MODEL` | Chat model (default `llama3.2`) |
| `OLLAMA_TIMEOUT_MS` / `OPENROUTER_TIMEOUT_MS` | Optional timeouts |
| `SMTP_*` / `RESEND_*` / `CONTACT_EMAIL` | Contact form |

Put secrets in `.env.local` and Vercel env (never commit).

## APIs

- `POST /api/chatbot` — local RAG site assistant (`components/chat/SiteChat.tsx`)
- `POST /api/contact` — contact form email
- `/email` — opens Gmail compose (shareable shortcut)

## Layout

```
app/            routes + API
components/     UI (home, services, work, chat, …)
lib/            chatLlm, chatKnowledge, services, work, site, …
public/         fonts, cursors, models, logos
```

## Deploy (Vercel)

1. Set `OPENROUTER_API_KEY` (and contact env vars) in Vercel Project Settings  
2. Optional: pin `OPENROUTER_MODEL` to a `:free` slug (paid ids are coerced; vanished free models fall back to `openrouter/free`)  
3. Deploy — chat hits OpenRouter; any LLM error falls back to local templates  

## Deploy (Hostinger / Node host)

1. Set contact + OpenRouter (or Ollama) env vars in the host panel  
2. Build: `npm run build`  
3. Start: `npm run start`  
4. Node 20.x  

Checklist: site loads, contact emails, HTTPS on. Live generative chat needs OpenRouter or a reachable Ollama.
