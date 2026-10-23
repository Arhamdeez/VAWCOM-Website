/* eslint-disable @typescript-eslint/no-require-imports -- Tailwind config is CommonJS */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{ts,tsx,js,jsx,mdx}',
    './app/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    extend: {
      // One motion scale (see lib/motion.ts). DEFAULT makes every bare `transition-*` utility use it.
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)',
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        micro: '150ms',
        std: '250ms',
        enter: '500ms',
        morph: '750ms',
        smooth: '300ms',
      },
    },
  },
  plugins: [],
};
