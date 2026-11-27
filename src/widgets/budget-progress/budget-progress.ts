import { formatMoney } from '@/shared/lib/money';
import { BUDGET_WARNING_THRESHOLD } from './model/constants';
import { createElement } from '@/shared/lib/dom/create-element';

interface BudgetProgressOptions {
  spentAmount: number;
  budgetAmount: number;
}

interface BudgetProgressComponent {
  element: HTMLElement;
  update: (spentAmount: number, budgetAmount: number) => void;
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function createBudgetProgress({
  spentAmount,
  budgetAmount,
}: BudgetProgressOptions): BudgetProgressComponent {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');

  svg.setAttribute('viewBox', '0 0 132 132');
  svg.setAttribute('class', 'budget-progress__ring');
  svg.setAttribute('aria-hidden', 'true');

  const track = document.createElementNS(SVG_NAMESPACE, 'circle');
  track.setAttribute('class', 'budget-progress__track');
  track.setAttribute('cx', '66');
  track.setAttribute('cy', '66');
  track.setAttribute('r', String(RING_RADIUS));

  const value = document.createElementNS(SVG_NAMESPACE, 'circle');
  value.setAttribute('class', 'budget-progress__value');
  value.setAttribute('cx', '66');
  value.setAttribute('cy', '66');
  value.setAttribute('r', String(RING_RADIUS));
  value.setAttribute('transform', 'rotate(-90 66 66)');

  const percentage = document.createElementNS(SVG_NAMESPACE, 'text');
  percentage.setAttribute('class', 'budget-progress__percentage');
  percentage.setAttribute('x', '66');
  percentage.setAttribute('y', '62');

  const caption = document.createElementNS(SVG_NAMESPACE, 'text');
  caption.setAttribute('class', 'budget-progress__caption');
  caption.setAttribute('x', '66');
  caption.setAttribute('y', '84');
  caption.textContent = 'of budget';

  svg.append(track, value, percentage, caption);

  const title = createElement('p', {
    classNames: 'budget-progress__title',
    textContent: 'Monthly budget',
  });

  const remaining = createElement('p', {
    classNames: 'budget-progress__remaining',
  });

  const total = createElement('p', {
    classNames: 'budget-progress__total',
  });

  const status = createElement('span', {
    classNames: 'budget-progress__status',
  });

  const details = createElement('div', {
    classNames: 'budget-progress__details',
    children: [title, remaining, total, status],
  });

  const element = createElement('div', {
    classNames: 'budget-progress',
    attributes: {
      'aria-label': 'Monthly budget progress',
    },
    children: [svg, details],
  });

  function update(nextSpentAmount: number, nextBudgetAmount: number): void {
    const spentPercentage = nextBudgetAmount > 0 ? (nextSpentAmount / nextBudgetAmount) * 100 : 0;

    const displayedPercentage = Math.round(spentPercentage);
    const progress = Math.min(Math.max(spentPercentage, 0), 100);
    const dashOffset = RING_CIRCUMFERENCE * (1 - progress / 100);

    value.setAttribute('stroke-dasharray', String(RING_CIRCUMFERENCE));
    value.setAttribute('stroke-dashoffset', String(dashOffset));

    percentage.textContent = `${displayedPercentage}%`;

    const remainingAmount = nextBudgetAmount - nextSpentAmount;

    remaining.textContent = `${formatMoney(remainingAmount)} left`;
    total.textContent = `of ${formatMoney(nextBudgetAmount)}`;

    let statusClass: 'normal' | 'warning' | 'exceeded';

    if (spentPercentage >= 100) {
      status.textContent = 'Over budget';
      statusClass = 'exceeded';
    } else if (spentPercentage >= BUDGET_WARNING_THRESHOLD) {
      status.textContent = 'Close to limit';
      statusClass = 'warning';
    } else {
      status.textContent = 'On track';
      statusClass = 'normal';
    }

    status.className = `budget-progress__status budget-progress__status--${statusClass}`;

    value.setAttribute('class', `budget-progress__value budget-progress__value--${statusClass}`);

    remaining.setAttribute(
      'aria-label',
      remainingAmount >= 0
        ? `${formatMoney(remainingAmount)} remaining`
        : `${formatMoney(Math.abs(remainingAmount))} over budget`,
    );
  }

  update(spentAmount, budgetAmount);

  return {
    element,
    update,
  };
}
