/**
 * Built-in validators backed by the Constraint Validation API.
 * Each returns `true` when valid, or an error message string when invalid.
 */

export const builtInValidators = {
  required(field, { messages }) {
    if (field.validity.valueMissing) {
      return resolveMessage(messages.required, field, 'This field is required');
    }
    return true;
  },

  type(field, { messages }) {
    if (field.validity.typeMismatch) {
      return resolveMessage(messages.type, field, 'Please enter a valid value');
    }
    return true;
  },

  pattern(field, { messages }) {
    if (field.validity.patternMismatch) {
      return resolveMessage(messages.pattern, field, 'Please match the requested format');
    }
    return true;
  },

  min(field, { messages }) {
    if (field.validity.rangeUnderflow) {
      return resolveMessage(
        messages.min,
        field,
        `Min value is ${field.min}.`,
      );
    }
    return true;
  },

  max(field, { messages }) {
    if (field.validity.rangeOverflow) {
      return resolveMessage(
        messages.max,
        field,
        `Max value is ${field.max}.`,
      );
    }
    return true;
  },

  minLength(field, { messages }) {
    if (field.validity.tooShort) {
      return resolveMessage(
        messages.minLength,
        field,
        `Please use at least ${field.minLength} characters.`,
      );
    }
    return true;
  },

  maxLength(field, { messages }) {
    if (field.validity.tooLong) {
      return resolveMessage(
        messages.maxLength,
        field,
        `Please use no more than ${field.maxLength} characters.`,
      );
    }
    return true;
  },

  step(field, { messages }) {
    if (field.validity.stepMismatch) {
      return resolveMessage(messages.step, field, 'Please enter a valid value');
    }
    return true;
  },

  badInput(field, { messages }) {
    if (field.validity.badInput) {
      return resolveMessage(messages.badInput, field, 'Please enter a valid value');
    }
    return true;
  },
};

/**
 * @param {string|((field: HTMLElement) => string)|undefined} message
 * @param {HTMLElement} field
 * @param {string} fallback
 */
function resolveMessage(message, field, fallback) {
  if (typeof message === 'function') return message(field);
  if (typeof message === 'string') return message;
  return fallback;
}
