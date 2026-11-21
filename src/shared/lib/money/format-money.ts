const MINUS_SIGN = '−'; // U+2212, as in the design

// 1.5 is always written as "1<separator>5", so the second character is the separator.
function getDecimalSeparator(locale: string): string {
  return (1.5).toLocaleString(locale).charAt(1);
}

/** Formats integer cents: 150000 → '1500,00' (de-DE) or '1500.00' (en-US). */
export function formatMoney(cents: number, locale = navigator.language): string {
  const sign = cents < 0 ? MINUS_SIGN : '';
  const absolute = Math.abs(cents);

  const units = Math.trunc(absolute / 100);
  const rest = String(absolute % 100).padStart(2, '0');

  return `${sign}${units}${getDecimalSeparator(locale)}${rest}`;
}

/** Like formatMoney, but positive amounts get '+': 620000 → '+6200,00'. */
export function formatSignedMoney(cents: number, locale = navigator.language): string {
  const formatted = formatMoney(cents, locale);

  return cents > 0 ? `+${formatted}` : formatted;
}
