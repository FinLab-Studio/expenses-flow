export function getCalendarDays(displayedMonth: Temporal.PlainDate): (number | null)[] {
  const daysInMonth = displayedMonth.daysInMonth;
  const offset = displayedMonth.dayOfWeek - 1;

  const days = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const remainingCells = (7 - (days.length % 7)) % 7;

  return [...days, ...Array.from({ length: remainingCells }, () => null)];
}
