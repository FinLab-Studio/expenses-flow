import type { CategoryIconOptions } from '../model/category-icon-options.interface';
import { CATEGORY_ICONS } from '@/entities/category/model/config/category-icons';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export function createCategoryIcon({ icon, classNames }: CategoryIconOptions): SVGSVGElement {
  const { label, path } = CATEGORY_ICONS[icon];

  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  const pathElement = document.createElementNS(SVG_NAMESPACE, 'path');

  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);

  if (classNames) {
    svg.setAttribute('class', classNames);
  }

  pathElement.setAttribute('d', path);
  svg.append(pathElement);

  return svg;
}
