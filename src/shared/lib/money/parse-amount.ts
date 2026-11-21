export function parseAmount(input: string): number {
  const [whole, fraction = ''] = input.split(/[.,]/);

  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));

  return cents;
}
