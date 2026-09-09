/* eslint-disable @typescript-eslint/no-require-imports -- Tailwind config is CommonJS */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{ts,tsx,js,jsx,mdx}',
    './app/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        smooth: '300ms',
      },
    },
  },
  plugins: [],
};
