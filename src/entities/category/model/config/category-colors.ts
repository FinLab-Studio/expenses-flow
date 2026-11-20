export const CATEGORY_COLORS = {
  indigo: {
    icon: '#4F46E5',
    tint: '#EEF0FF',
    chart: '#4F46E5',
    dark: '#8EA2FF',
  },
  teal: {
    icon: '#0E7490',
    tint: '#E0F2FE',
    chart: '#0891B2',
    dark: '#67E8F9',
  },
  green: {
    icon: '#047857',
    tint: '#E7F6EF',
    chart: '#10B981',
    dark: '#5EEAD4',
  },
  amber: {
    icon: '#B45309',
    tint: '#FEF3C7',
    chart: '#F59E0B',
    dark: '#F6C962',
  },
  pink: {
    icon: '#BE185D',
    tint: '#FCE7F3',
    chart: '#DB2777',
    dark: '#F9A8D4',
  },
  rust: {
    icon: '#9A3412',
    tint: '#FFEDD5',
    chart: '#EA580C',
    dark: '#FDBA74',
  },
  violet: {
    icon: '#7C3AED',
    tint: '#F3E8FF',
    chart: '#8B5CF6',
    dark: '#C4B5FD',
  },
  gray: {
    icon: '#4B5563',
    tint: '#F3F4F6',
    chart: '#9CA3AF',
    dark: '#9AA3C7',
  },
} as const;

export type CategoryColor = keyof typeof CATEGORY_COLORS;
