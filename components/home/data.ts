export const AUTOMATION_STEPS = [
  {
    bg: '#0f5c46',
    ink: '#f4fbf7',
    inkSoft: 'rgba(244,251,247,0.55)',
    chip: 'rgba(244,251,247,0.14)',
    head: 'A message arrives',
    proof: '"My order hasn\'t shipped yet."',
  },
  {
    bg: '#1f7f9c',
    ink: '#f2fbfd',
    inkSoft: 'rgba(242,251,253,0.55)',
    chip: 'rgba(242,251,253,0.14)',
    head: 'It gets read',
    proof: 'Order status · needs a reply today',
  },
  {
    bg: '#cf6a2c',
    ink: '#fff8ef',
    inkSoft: 'rgba(255,248,239,0.6)',
    chip: 'rgba(255,248,239,0.16)',
    head: 'A reply is written',
    proof: '"Left this morning — due Thursday. Here is the tracking."',
  },
  {
    bg: '#6c4bb0',
    ink: '#f8f4ff',
    inkSoft: 'rgba(248,244,255,0.55)',
    chip: 'rgba(248,244,255,0.14)',
    head: 'A record is kept',
    proof: '#40219 · answered in one minute',
  },
  {
    bg: '#e8e2d4',
    ink: '#14100c',
    inkSoft: 'rgba(20,16,12,0.5)',
    chip: 'rgba(20,16,12,0.1)',
    head: 'A person is told',
    proof: 'Ayesha — refund on #40219 needs your yes.',
  },
] as const;

export const SERVICE_TRACK = [
  {
    title: 'Web Development',
    body: 'We build websites and web apps that load fast and hold up as your business grows.',
    color: '#429f7f',
  },
  {
    title: 'App Development',
    body: 'One mobile app, built once, running properly on both iPhone and Android.',
    color: '#63cbc0',
  },
  {
    title: 'E-commerce',
    body: 'Online stores with reliable checkout and stock levels that match your warehouse.',
    color: '#cf6a2c',
  },
  {
    title: 'Website Maintenance',
    body: 'We keep your site updated, monitored, and backed up so problems never reach your customers.',
    color: '#6c4bb0',
  },
  {
    title: 'Bug Fixing',
    body: 'When something breaks, we trace the cause and fix it properly instead of patching the symptom.',
    color: '#1f7f9c',
  },
  {
    title: 'Code Cleanup',
    body: 'We clean up existing code so future changes take less time and cost you less.',
    color: '#d9a961',
  },
] as const;

export const CHAT_SUGGESTIONS = [
  'Payment terms?',
  'Can they leave early?',
  'Who owns the work?',
] as const;

export const FOUNDERS = [
  {
    initials: 'AB',
    name: 'Arham Babar',
    role: 'Co-founder',
    linkedin: 'https://www.linkedin.com/in/arham-babar-a9510630a/',
    github: 'https://github.com/Arhamdeez',
  },
  {
    initials: 'SK',
    name: 'Shahbakht Khurram',
    role: 'Co-founder',
    linkedin: 'https://www.linkedin.com/in/shahbakht-khurram-b322a8329',
    github: 'https://github.com/shahbakht11',
  },
] as const;
