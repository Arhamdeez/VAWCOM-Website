/** Shared Framer Motion presets — fast, snappy UI (ambient loops use their own longer durations). */
export const easeSnappy = [0.4, 0, 0.2, 1] as const;

export const ui = {
  /** Route / page cross-fade */
  pageMs: 0.22,
  /** Hero, sections */
  enter: 0.36,
  /** Stagger steps */
  stagger: 0.06,
  /** whileInView blocks */
  reveal: 0.3,
} as const;
