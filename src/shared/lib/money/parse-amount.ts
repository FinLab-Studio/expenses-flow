/**
 * Converts an amount string to integer cents: '12,5' → 1250.
 * Call it only after validateAmount() returned null.
 */
export function parseAmount(input: string): number {
  const [whole, fraction = ''] = input.split(/[.,]/);

  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));

  return cents;
}
