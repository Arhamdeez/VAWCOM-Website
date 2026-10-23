'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Company film. Before it starts, a "Play" bubble follows the pointer over the whole frame
 * (click anywhere to play, with sound). On touch screens, and at rest, it sits in the centre.
 * Once playing, the native controls take over.
 */
export default function CompanyFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [hovering, setHovering] = useState(false);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // Called from a click, so sound is allowed.
    v.muted = false;
    v.volume = 1;
    setStarted(true);
    void v.play().catch(() => setStarted(false));
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => {
      v.currentTime = 0;
      setStarted(false);
    };
    v.addEventListener('ended', onEnded);
    return () => v.removeEventListener('ended', onEnded);
  }, []);

  // Bubble tracks the pointer directly (no React state per move).
  const move = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const frame = frameRef.current;
    const bubble = bubbleRef.current;
    if (!frame || !bubble) return;
    const r = frame.getBoundingClientRect();
    bubble.style.left = `${e.clientX - r.left}px`;
    bubble.style.top = `${e.clientY - r.top}px`;
  }, []);

  const enter = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    setHovering(true);
    move(e);
    // Start buffering now so the click plays straight away.
    if (videoRef.current) videoRef.current.preload = 'auto';
  }, [move]);

  return (
    <div ref={frameRef} className="relative">
      <video
        ref={videoRef}
        className="block aspect-video w-full bg-[#161615] object-contain"
        src="/vawcom_video.mp4"
        poster="/vawcom_video_poster.jpg"
        controls={started}
        playsInline
        preload="metadata"
        aria-label="VAWCOM company film"
      />

      {!started && (
        <button
          type="button"
          onClick={play}
          onPointerEnter={enter}
          onPointerMove={move}
          onPointerLeave={() => {
            setHovering(false);
            // back to the centre resting spot
            if (bubbleRef.current) {
              bubbleRef.current.style.left = '';
              bubbleRef.current.style.top = '';
            }
          }}
          aria-label="Play the company film with sound"
          className="vaw-film-hit absolute inset-0 block h-full w-full border-0 bg-transparent p-0"
        >
          <span
            ref={bubbleRef}
            aria-hidden
            className={`pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1.5 rounded-full bg-white/95 text-[#161615] shadow-[0_6px_20px_rgba(0,0,0,0.28)] transition-[width,height,padding] duration-micro ${
              hovering ? 'h-9 px-4 text-[13px] font-medium' : 'h-11 w-11'
            }`}
          >
            <Play className={`fill-current ${hovering ? 'h-3 w-3' : 'ml-0.5 h-4 w-4'}`} />
            {hovering ? <span>Play</span> : null}
          </span>
        </button>
      )}
    </div>
  );
}
