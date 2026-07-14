import { addClasses, removeClasses } from '../dom/classes.js';
import { insertErrorAfter } from '../dom/errors.js';

/**
 * Support for Bootstrap Select / selectpicker widgets.
 * Targets the toggle button instead of the hidden native `<select>`.
 *
 * @param {object} [config]
 * @param {string} [config.matchClass='selectpicker']
 * @returns {object}
 */
export function createBootstrapSelectExtension({
  matchClass = 'selectpicker',
} = {}) {
  function matches(field) {
    return field.classList.contains(matchClass);
  }

  function selectButton(field) {
    return field.parentElement?.querySelector('button') ?? null;
  }

  return {
    name: 'bootstrapSelect',

    showErrorMessage(field, message, options, next) {
      if (!matches(field)) return next();

      const button = selectButton(field);
      if (!button) return;

      insertErrorAfter(button, message, options);
    },

    highlightField(field, options, next) {
      if (!matches(field)) return next();

      const button = selectButton(field);
      if (button) addClasses(button, options.errorClass);
    },

    unhighlightField(field, options, next) {
      if (!matches(field)) return next();

      const button = selectButton(field);
      if (button) removeClasses(button, options.errorClass);
    },
  };
}

export const bootstrapSelectExtension = createBootstrapSelectExtension();
