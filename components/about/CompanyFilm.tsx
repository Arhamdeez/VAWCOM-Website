'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Company film. A centred play button starts it with sound. Once playing, the native controls take over.
 */
export default function CompanyFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

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

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="block aspect-video w-full bg-[#161615] object-contain object-[center_calc(50%-0.75rem)]"
        src="/vawcom_video.mp4"
        poster="/thumbnail.png"
        controls={started}
        playsInline
        preload="metadata"
        aria-label="VAWCOM company film"
      />

      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label="Play the company film with sound"
          className="absolute inset-0 block h-full w-full border-0 bg-transparent p-0"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#161615] shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.28)]"
          >
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
