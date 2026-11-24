export interface CreateElementOptions {
  classNames?: string;
  textContent?: string;
  attributes?: Record<string, string | boolean>;
  children?: readonly Node[];
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: CreateElementOptions = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options.classNames) {
    element.className = options.classNames;
  }

  if (options.textContent !== undefined) {
    element.textContent = options.textContent;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([name, value]) => {
      if (typeof value === 'boolean') {
        if (value) {
          element.setAttribute(name, '');
        }
      } else {
        element.setAttribute(name, value);
      }
    });
  }

  if (options.children) {
    element.append(...options.children);
  }

  return element;
}
