import type { SvgIconOptions } from './svg-icon-options.interface';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export function createSvgIcon({
  path,
  classNames,
  ariaLabel,
  ariaHidden = true,
}: SvgIconOptions): SVGSVGElement {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  const pathElement = document.createElementNS(SVG_NAMESPACE, 'path');

  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  if (classNames) {
    svg.setAttribute('class', classNames);
  }

  if (ariaLabel) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', ariaLabel);
  } else if (ariaHidden) {
    svg.setAttribute('aria-hidden', 'true');
  }

  pathElement.setAttribute('d', path);
  svg.append(pathElement);

  return svg;
}
