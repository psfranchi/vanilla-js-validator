/**
 * Example: write a custom extension for an input group.
 *
 * HTML shape:
 *
 * <div class="vj-field">
 *   <div class="input-group">
 *     <span class="input-group-prefix">$</span>
 *     <input class="amount-input" name="amount" type="number" required min="1" />
 *   </div>
 * </div>
 *
 * The visible border lives on `.input-group`, so we highlight that wrapper
 * and place the error message after it — not on the raw <input>.
 */

import {
  FormValidator,
  addClasses,
  removeClasses,
  insertErrorAfter,
} from '../../src/index.js';

export const amountInputExtension = {
  name: 'amountInput',

  // Always bail out with next() when the field is not yours.
  // That keeps default behavior for every other input.

  highlightField(field, options, next) {
    if (!field.classList.contains('amount-input')) return next();

    const group = field.closest('.input-group');
    if (group) addClasses(group, options.errorClass);
  },

  unhighlightField(field, options, next) {
    if (!field.classList.contains('amount-input')) return next();

    const group = field.closest('.input-group');
    if (group) removeClasses(group, options.errorClass);
  },

  showErrorMessage(field, message, options, next) {
    if (!field.classList.contains('amount-input')) return next();

    const group = field.closest('.input-group');
    if (!group) return next();

    insertErrorAfter(group, message, options);
  },

  // removeErrorMessage is optional here — the default remover already
  // clears [data-vj-error] nodes inside fieldContainer / parent.
};

const form = document.querySelector('#checkout-form');

new FormValidator(form)
  .use(amountInputExtension)
  .setup();
