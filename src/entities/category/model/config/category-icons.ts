export const CATEGORY_ICONS = {
  cart: {
    label: 'Cart',
    path: 'M4 5h2l2 10h10l2-7H7M9 20h.01M17 20h.01',
  },
  home: {
    label: 'Home',
    path: 'M3 11l9-7 9 7M5 10v10h14V10',
  },
  bus: {
    label: 'Bus',
    path: 'M8 3h8a3 3 0 0 1 3 3v11H5V6a3 3 0 0 1 3-3zM5 11h14M8 21v-4M16 21v-4',
  },
  ticket: {
    label: 'Ticket',
    path: 'M4 7h16v10H4zM8 7v10M16 7v10',
  },
  health: {
    label: 'Health',
    path: 'M12 8v8M8 12h8M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0',
  },
  cup: {
    label: 'Cup',
    path: 'M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 10h2a2 2 0 0 1 0 4h-2',
  },
  paw: {
    label: 'Pets',
    path: 'M7 13c-1.5 0-2.5-1.5-2-3s2-2 3-1M17 13c1.5 0 2.5-1.5 2-3s-2-2-3-1M10 8c-1 0-2-1-2-2.5S9 3 10 3s2 1 2 2.5M14 8c1 0 2-1 2-2.5S15 3 14 3s-2 1-2 2.5M12 11c-3 0-5 3.5-5 6 0 2 2 3 5 3s5-1 5-3c0-2.5-2-6-5-6z',
  },
  book: {
    label: 'Book',
    path: 'M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z',
  },
  plane: {
    label: 'Travel',
    path: 'M3 12l18-8-6 17-3-7z',
  },
  gift: {
    label: 'Gift',
    path: 'M4 10h16v10H4zM12 10v10M4 10l1-3h14l1 3',
  },
  case: {
    label: 'Salary',
    path: 'M4 8h16v11H4zM9 8V5h6v3',
  },
  laptop: {
    label: 'Freelance',
    path: 'M5 6h14v9H5zM3 19h18',
  },
  dots: {
    label: 'Other',
    path: 'M6 12h.01M12 12h.01M18 12h.01',
  },
} as const;

export type CategoryIcon = keyof typeof CATEGORY_ICONS;

export const SELECTABLE_CATEGORY_ICONS = [
  'cart',
  'home',
  'bus',
  'ticket',
  'health',
  'cup',
  'paw',
  'book',
  'plane',
  'gift',
] as const satisfies readonly CategoryIcon[];
