/**
 * Example: factory-style extension for a custom select widget.
 *
 * Useful when several forms share the same widget but may use
 * different class names.
 *
 * HTML shape:
 *
 * <div class="vj-field">
 *   <div class="fancy-select">
 *     <select class="fancy-select-input" name="country" required>...</select>
 *     <button type="button" class="fancy-select-toggle">Pick a country</button>
 *   </div>
 * </div>
 */

import {
  FormValidator,
  addClasses,
  removeClasses,
  insertErrorAfter,
} from '../../src/index.js';

/**
 * @param {object} [config]
 * @param {string} [config.matchClass='fancy-select-input']
 * @param {string} [config.toggleSelector='.fancy-select-toggle']
 */
export function createFancySelectExtension({
  matchClass = 'fancy-select-input',
  toggleSelector = '.fancy-select-toggle',
} = {}) {
  const matches = (field) => field.classList.contains(matchClass);

  const toggleFor = (field) =>
    field.parentElement?.querySelector(toggleSelector) ?? null;

  return {
    name: 'fancySelect',

    showErrorMessage(field, message, options, next) {
      if (!matches(field)) return next();

      const toggle = toggleFor(field);
      if (!toggle) return;

      insertErrorAfter(toggle, message, options);
    },

    highlightField(field, options, next) {
      if (!matches(field)) return next();

      const toggle = toggleFor(field);
      if (toggle) addClasses(toggle, options.errorClass);
    },

    unhighlightField(field, options, next) {
      if (!matches(field)) return next();

      const toggle = toggleFor(field);
      if (toggle) removeClasses(toggle, options.errorClass);
    },
  };
}

const form = document.querySelector('#profile-form');

new FormValidator(form, { preset: 'bootstrap' })
  .use(createFancySelectExtension())
  // Same extension, different class names on another page:
  // .use(createFancySelectExtension({ matchClass: 'country-select' }))
  .setup();
