/** Shared studio process — used on About and service pages. */
export const PROCESS_STEPS = [
  {
    title: 'Idea',
    line: 'What problem, for whom, and what done looks like.',
  },
  {
    title: 'Planning',
    line: 'Scope, milestones, and tradeoffs on paper before code.',
  },
  {
    title: 'Wireframes',
    line: 'Flows and rough layouts so UX is cheap to change.',
  },
  {
    title: 'Structure',
    line: 'Architecture, data model, and the build order.',
  },
  {
    title: 'Development',
    line: 'UI, APIs, and integrations. Voice and AI when they earn their place.',
  },
  {
    title: 'Deploy',
    line: 'Release, monitor, and harden, then iterate from real usage.',
  },
] as const;
