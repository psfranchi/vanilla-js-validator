/**
 * Example: function extension (closest to the old loadValidatorOverrides style).
 *
 * Prefer object extensions with next() for new code — they compose better.
 * Function extensions are useful for one-off wiring or migrating old helpers.
 */

import {
  FormValidator,
  addClasses,
  removeClasses,
  defaultHooks,
} from '../../src/index.js';

/**
 * Old-style helper: wrap hooks on an existing validator instance.
 * @param {FormValidator} validator
 */
export function loadLegacySelectOverrides(validator) {
  const previousHighlight =
    validator.options.highlightField || defaultHooks.highlightField;
  const previousUnhighlight =
    validator.options.unhighlightField || defaultHooks.unhighlightField;

  validator.options.highlightField = (field, options, ctx) => {
    if (field.classList.contains('selectpicker')) {
      const button = field.parentElement?.querySelector('button');
      if (button) addClasses(button, options.errorClass);
      return;
    }
    previousHighlight(field, options, ctx);
  };

  validator.options.unhighlightField = (field, options, ctx) => {
    if (field.classList.contains('selectpicker')) {
      const button = field.parentElement?.querySelector('button');
      if (button) removeClasses(button, options.errorClass);
      return;
    }
    previousUnhighlight(field, options, ctx);
  };
}

const form = document.querySelector('#legacy-form');

new FormValidator(form, { preset: 'bootstrap' })
  .use(loadLegacySelectOverrides)
  .setup();
