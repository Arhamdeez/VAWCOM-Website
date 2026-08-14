'use client';

import Image from 'next/image';
import { CHAT_SUGGESTIONS } from './data';
import { useDocumentChat } from './demos/useDocumentChat';

export default function HeroSection() {
  const chat = useDocumentChat();

  return (
    <section id="top" className="relative">
      <div data-zoom-wrap className="relative h-[260vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            data-device
            className="absolute left-1/2 top-1/2 z-0 w-[min(62vw,860px)] origin-[50%_64%] -translate-x-1/2 -translate-y-[30%] will-change-transform"
          >
            <div className="rounded-[10px] border-2 border-[rgba(66,159,127,0.55)] bg-[#0f1412] p-3">
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded bg-black">
                <Image
                  src="/vawcom-logo-3d.png"
                  alt=""
                  width={480}
                  height={480}
                  className="h-auto w-[56%] object-contain"
                  priority
                />
              </div>
            </div>
            <div className="mx-auto mt-0 h-2 w-[38%] rounded-b-md bg-[rgba(66,159,127,0.35)]" />
          </div>

          <div
            data-hero-copy
            className="pointer-events-none absolute inset-0 z-[1] mx-auto flex max-w-[1440px] flex-col justify-between px-8 pb-0 pt-[120px] will-change-transform"
          >
            <div>
              <div className="relative mt-[22px] h-[26px]">
                <div
                  data-quip
                  className="relative inline-block text-[15px] text-[rgba(236,233,227,0.5)] opacity-0"
                >
                  <span>Yeah, we&apos;re a dev agency.</span>
                  <span
                    data-strike
                    className="absolute left-0 top-[52%] block h-0.5 w-0 bg-[#429f7f]"
                  />
                </div>
              </div>
              <h1
                data-headline
                className="vaw-display mt-3.5 max-w-[15ch] text-[clamp(46px,7.6vw,118px)] leading-[0.9]"
              >
                Transform Your Business with{' '}
                <span className="text-[#429f7f]">AI-Powered</span> Innovation
              </h1>
              <p
                data-subhead
                className="mt-[34px] max-w-[46ch] text-lg leading-normal text-[rgba(236,233,227,0.72)]"
              >
                Watch it work. Then bring us the brief.
              </p>
            </div>

            <div className="relative flex justify-end pb-[55px] pr-[25px] pointer-events-auto">
              <div data-cta className="flex flex-wrap gap-4">
                <a
                  href="#demos"
                  className="vaw-wavy bg-[#429f7f] px-[34px] py-[26px] text-[15px] font-medium text-[#0b0d0c] hover:bg-[#429f7f]/85 hover:text-[#0b0d0c]"
                >
                  Try the demos
                </a>
                <a
                  href="#process"
                  className="vaw-wavy bg-[rgba(236,233,227,0.1)] px-[34px] py-[26px] text-[15px] text-[#ece9e3] hover:bg-[rgba(66,159,127,0.25)] hover:text-[#ece9e3]"
                >
                  What we do
                </a>
              </div>
              <div className="absolute bottom-3.5 left-0 right-0 h-px bg-[rgba(236,233,227,0.18)]" />
            </div>
          </div>

          {/* Chatbot portal — overlays sticky viewport after zoom */}
          <div
            data-hero-screen
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#0b0d0c] opacity-0 will-change-[transform,opacity]"
          >
            <div className="grid w-full max-w-[1240px] grid-cols-1 items-center gap-8 px-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-12">
              <div>
                <h2 className="vaw-display max-w-[14ch] text-[clamp(30px,4vw,64px)] leading-[0.94]">
                  <span className="text-[#cf6a2c]">A chatbot</span> that reads your documents
                </h2>
                <p className="mt-[18px] max-w-[34ch] text-[16.5px] leading-snug text-[rgba(236,233,227,0.68)]">
                  Hand it a contract and ask in plain words. It answers from your file. Upload, then
                  type a question.
                </p>
                <div className="mt-[22px] flex flex-wrap gap-2.5">
                  {CHAT_SUGGESTIONS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => chat.ask(label)}
                      className="vaw-wavy border-0 bg-[rgba(66,159,127,0.22)] px-[22px] py-[18px] text-[13.5px] text-[#ece9e3] hover:bg-[rgba(66,159,127,0.45)]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex h-[min(66vh,420px)] flex-col gap-3 border border-[rgba(236,233,227,0.2)] bg-[#131816] p-[22px]">
                <div className="flex items-center justify-between gap-3 text-[13.5px] text-[rgba(236,233,227,0.5)]">
                  <label className="min-w-0 cursor-pointer truncate hover:text-[#429f7f]">
                    <input
                      type="file"
                      accept=".txt,.pdf,.doc,.docx,.md"
                      className="hidden"
                      disabled={chat.uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void chat.upload(f);
                        e.target.value = '';
                      }}
                    />
                    {chat.uploading
                      ? 'Uploading…'
                      : chat.file
                        ? `${chat.file.name}`
                        : 'Upload a document'}
                  </label>
                  <span className="flex shrink-0 items-center gap-2">
                    {chat.file ? (
                      <button
                        type="button"
                        onClick={() => void chat.clearDoc()}
                        className="text-[rgba(236,233,227,0.45)] hover:text-[#cf6a2c]"
                      >
                        Clear
                      </button>
                    ) : null}
                    <span className="text-[#429f7f]">{chat.file ? 'ready' : 'idle'}</span>
                  </span>
                </div>

                <div ref={chat.logRef} className="flex flex-1 flex-col gap-3 overflow-auto">
                  {chat.messages.map((m, i) => (
                    <div
                      key={`${i}-${m.text.slice(0, 12)}`}
                      className={`max-w-[86%] px-3.5 py-2.5 text-[15px] leading-snug ${
                        m.role === 'user'
                          ? 'self-end bg-[#429f7f] text-[#0b0d0c]'
                          : 'self-start bg-[rgba(236,233,227,0.08)] text-[#ece9e3]'
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                  {chat.typing ? (
                    <div className="self-start bg-[rgba(236,233,227,0.08)] px-3.5 py-2.5 text-[15px] text-[rgba(236,233,227,0.5)]">
                      …
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2.5 border-t border-[rgba(236,233,227,0.18)] pt-3.5">
                  <input
                    value={chat.draft}
                    onChange={(e) => chat.setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void chat.ask();
                    }}
                    placeholder="Type a question…"
                    className="min-w-0 flex-1 border-none bg-transparent text-[14.5px] text-[#ece9e3] outline-none placeholder:text-[rgba(236,233,227,0.35)]"
                    disabled={chat.typing}
                  />
                  <button
                    type="button"
                    onClick={() => void chat.ask()}
                    disabled={chat.typing || !chat.draft.trim()}
                    className="flex-none rounded-sm bg-[#429f7f] px-4 py-2 text-sm font-medium text-[#0b0d0c] hover:bg-[#429f7f]/85 disabled:opacity-40"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
