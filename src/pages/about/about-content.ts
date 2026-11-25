// Lists shown on the About page. The markup is in about-page.ts; edit the content here.

export interface Feature {
  title: string;
  text: string;
  icon: string; // inner SVG markup, viewBox 0 0 24 24 (from the design)
}

export const FEATURES: Feature[] = [
  {
    title: 'Track income and expenses',
    text: 'Add, edit and delete operations by category. Filter history by dates and categories.',
    icon: '<path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" />',
  },
  {
    title: 'Stay within budget',
    text: 'Set a monthly limit. FinLab warns you at 80% and shows when you go over.',
    icon: '<circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 9 9h-9z" />',
  },
  {
    title: 'See the trends',
    text: 'Spending by category and month-to-month comparison for the last six months.',
    icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />',
  },
];

export interface TeamMember {
  name: string;
  github: string; // GitHub login
  contributions: string[]; // updated before the release
}

export const TEAM: TeamMember[] = [
  {
    name: 'Alena',
    github: 'AlenaVP',
    contributions: [
      'Project setup: Vite, TypeScript, Vitest, ESLint, Prettier, CI',
      'App shell, router and this About page',
      'Transaction form and amount validation',
      'Monthly budget and currency settings',
    ],
  },
  {
    name: 'Evgenia',
    github: 'evgeniia-korolova',
    contributions: [
      'GitHub organization, repository and task board',
      'Transaction history and filters',
      'Dashboard cards and balance',
      'Charts, month comparison and demo data',
    ],
  },
];

export const PROCESS: string[] = [
  'GitHub Projects board',
  'Feature branches and squash PRs into dev',
  'Code review for every PR',
  'CI: lint, types, tests, build',
  'Daily sync at 20:00',
  'TypeScript · Vite · Vitest · SCSS',
];
