import { describe, it, expect } from 'vitest';
import { createElement } from './create-element';

describe('createElement', () => {
  it('should create an element with the specified tag name', () => {
    const element = createElement('div');

    expect(element.tagName).toBe('DIV');
  });

  it('should apply CSS classes to the element', () => {
    const element = createElement('div', {
      classNames: 'transactions__item transactions__item--active',
    });

    expect(element.className).toBe('transactions__item transactions__item--active');
  });

  it('should set text content to the element', () => {
    const element = createElement('p', {
      textContent: 'Transaction description',
    });

    expect(element.textContent).toBe('Transaction description');
  });

  it('should set attributes on the element', () => {
    const element = createElement('button', {
      attributes: {
        type: 'button',
        'aria-label': 'Add transaction',
        'data-testid': 'add-button',
      },
    });

    expect(element.getAttribute('type')).toBe('button');
    expect(element.getAttribute('aria-label')).toBe('Add transaction');
    expect(element.getAttribute('data-testid')).toBe('add-button');
    expect(element.attributes).toHaveLength(3);
  });

  it('should append child nodes to the element', () => {
    const child = document.createElement('span');
    child.textContent = 'Transaction';

    const element = createElement('div', {
      children: [child],
    });

    expect(element.children).toHaveLength(1);
    expect(element.firstElementChild).toBe(child);
  });

  it('should append text nodes to the element', () => {
    const textNode = document.createTextNode('Total: 100');

    const element = createElement('div', {
      children: [textNode],
    });

    expect(element.textContent).toBe('Total: 100');
    expect(element.firstChild).toBe(textNode);
  });

  it('should preserve the order of child nodes', () => {
    const firstChild = document.createElement('span');
    const secondChild = document.createElement('p');
    const thirdChild = document.createTextNode('Total');

    const element = createElement('div', {
      children: [firstChild, secondChild, thirdChild],
    });

    expect(element.childNodes[0]).toBe(firstChild);
    expect(element.childNodes[1]).toBe(secondChild);
    expect(element.childNodes[2]).toBe(thirdChild);
  });

  it('should set empty text content', () => {
    const element = createElement('p', {
      textContent: '',
    });

    expect(element.textContent).toBe('');
  });

  it('should handle an empty children array', () => {
    const element = createElement('div', {
      children: [],
    });

    expect(element.childNodes).toHaveLength(0);
  });

  it('should set boolean attributes when value is true', () => {
    const element = createElement('button', {
      attributes: {
        disabled: true,
      },
    });

    expect(element.hasAttribute('disabled')).toBe(true);
    expect(element.disabled).toBe(true);
  });

  it('should not set boolean attributes when value is false', () => {
    const element = createElement('button', {
      attributes: {
        disabled: false,
      },
    });

    expect(element.hasAttribute('disabled')).toBe(false);
    expect(element.disabled).toBe(false);
  });

  it('should preserve string values for ARIA attributes', () => {
    const element = createElement('div', {
      attributes: {
        'aria-hidden': 'false',
      },
    });

    expect(element.getAttribute('aria-hidden')).toBe('false');
  });
});
