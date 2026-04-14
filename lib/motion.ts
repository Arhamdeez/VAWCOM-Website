/** Shared Framer Motion presets — fast, snappy UI (ambient loops use their own longer durations). */
export const easeSnappy = [0.4, 0, 0.2, 1] as const;

/** Softer ease for route transitions (gentle deceleration, no snap). */
export const easePage = [0.16, 1, 0.3, 1] as const;

export const ui = {
  /** Dark veil lift (route change) */
  pageVeilMs: 0.48,
  /** Page content after veil */
  pageContentMs: 0.5,
  /** Stagger: veil leads, content follows */
  pageEnterDelay: 0.07,
  /** Legacy alias — content timing */
  pageMs: 0.5,
  /** Hero, sections */
  enter: 0.36,
  /** Stagger steps */
  stagger: 0.06,
  /** whileInView blocks */
  reveal: 0.3,
} as const;
