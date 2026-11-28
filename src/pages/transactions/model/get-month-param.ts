// 'YYYY-MM' with a real month number: '2026-10' fits; 'abc' and '2026-13' don't
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

/**
 * The month from the page address, set by "View all" on the Dashboard:
 * '#/transactions?month=2026-10' → '2026-10'. No month or a wrong one → null,
 * and the page shows the current month instead of failing to load.
 */
export function getMonthParam(hash: string): string | null {
  const query = hash.split('?')[1] ?? '';
  const month = new URLSearchParams(query).get('month');

  if (month === null) {
    return null;
  }

  return MONTH_PATTERN.test(month) ? month : null;
}
