import { createSvgIcon } from '@/shared/components/icon/create-svg-icon';

export function createMonthSwitcherIcon(direction: 'previous' | 'next'): SVGSVGElement {
  const paths = {
    previous: 'M15 6l-6 6 6 6',
    next: 'M9 6l6 6-6 6',
  };

  return createSvgIcon({
    path: paths[direction],
    classNames: 'month-switcher__icon',
  });
}
