import { addClasses, removeClasses } from './classes.js';
import {
  getCheckboxGroup,
  getErrorPlacement,
  getRadioGroup,
} from '../fields.js';

export const ERROR_ATTR = 'data-vj-error';

/**
 * @param {HTMLElement} field
 * @param {object} options
 */
export function getFieldContainer(field, options) {
  if (options.fieldContainer) {
    return field.closest(options.fieldContainer) || field.parentElement;
  }
  return field.parentElement;
}

/**
 * Build an error message element using the active class/element options.
 * @param {Element|Document} host
 * @param {string} message
 * @param {object} options
 */
export function createErrorElement(host, message, options) {
  const doc = host.ownerDocument || host;
  const errorEl = doc.createElement(options.errorElement || 'span');
  errorEl.setAttribute(ERROR_ATTR, 'true');
  addClasses(errorEl, options.errorMessageClass);
  errorEl.textContent = message;
  return errorEl;
}

/**
 * Insert an error message immediately after a reference element.
 * @param {Element} referenceEl
 * @param {string} message
 * @param {object} options
 */
export function insertErrorAfter(referenceEl, message, options) {
  const errorEl = createErrorElement(referenceEl, message, options);
  referenceEl.insertAdjacentElement('afterend', errorEl);
  return errorEl;
}

/**
 * Place an error using the resolved placement strategy.
 * @param {HTMLElement} field
 * @param {string} message
 * @param {object} options
 */
export function placeErrorMessage(field, message, options) {
  const placement = getErrorPlacement(field, options);
  const errorEl = createErrorElement(placement.target, message, options);

  if (placement.mode === 'append') {
    placement.target.appendChild(errorEl);
  } else {
    placement.target.insertAdjacentElement('afterend', errorEl);
  }

  return errorEl;
}

/**
 * @param {HTMLElement} field
 * @param {object} options
 */
export function defaultHighlightField(field, options) {
  if (field.type === 'radio') {
    for (const radio of getRadioGroup(field)) {
      addClasses(radio, options.errorClass);
    }
    return;
  }

  if (field.type === 'checkbox') {
    const group = getCheckboxGroup(field);
    if (group.length > 1) {
      for (const box of group) {
        addClasses(box, options.errorClass);
      }
      return;
    }
  }

  addClasses(field, options.errorClass);
}

/**
 * @param {HTMLElement} field
 * @param {object} options
 */
export function defaultUnhighlightField(field, options) {
  if (field.type === 'radio') {
    for (const radio of getRadioGroup(field)) {
      removeClasses(radio, options.errorClass);
    }
    return;
  }

  if (field.type === 'checkbox') {
    const group = getCheckboxGroup(field);
    if (group.length > 1) {
      for (const box of group) {
        removeClasses(box, options.errorClass);
      }
      return;
    }
  }

  removeClasses(field, options.errorClass);
}

/**
 * @param {HTMLElement} field
 * @param {string} message
 * @param {object} options
 */
export function defaultShowErrorMessage(field, message, options) {
  placeErrorMessage(field, message, options);
}

/**
 * @param {HTMLElement} field
 * @param {object} options
 */
export function defaultRemoveErrorMessage(field, options) {
  const container = getFieldContainer(field, options);
  if (!container) return;

  container.querySelectorAll(`[${ERROR_ATTR}]`).forEach((el) => {
    el.remove();
  });

  // Choice errors may sit as a sibling after the wrapping label when
  // fieldContainer is missing — clear that sibling as well.
  if (field.type === 'radio' || field.type === 'checkbox') {
    const label = field.closest('label');
    const sibling = label?.nextElementSibling;
    if (sibling?.hasAttribute?.(ERROR_ATTR)) {
      sibling.remove();
    }
  }
}

export const defaultHooks = {
  highlightField: defaultHighlightField,
  unhighlightField: defaultUnhighlightField,
  showErrorMessage: defaultShowErrorMessage,
  removeErrorMessage: defaultRemoveErrorMessage,
};

/**
 * Refresh error UI for a field.
 * @param {HTMLElement} field
 * @param {boolean} isValid
 * @param {object} options
 * @param {object} hooks
 */
export function refreshFieldError(field, isValid, options, hooks) {
  const ctx = { field, options };

  hooks.unhighlightField(field, options, ctx);
  hooks.removeErrorMessage(field, options, ctx);

  if (!isValid) {
    const message = field.validationMessage;
    hooks.showErrorMessage(field, message, options, ctx);
    hooks.highlightField(field, options, ctx);
  }
}
