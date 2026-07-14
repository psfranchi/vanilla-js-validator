import { applyExtension } from './applyExtension.js';
import {
  bootstrapSelectExtension,
  createBootstrapSelectExtension,
} from './bootstrapSelect.js';
import {
  tinymceExtension,
  createTinymceExtension,
} from './tinymce.js';

export {
  applyExtension,
  bootstrapSelectExtension,
  createBootstrapSelectExtension,
  tinymceExtension,
  createTinymceExtension,
};

/**
 * Drop-in style helper similar to the original `loadValidatorOverrides`.
 * Registers Bootstrap Select + TinyMCE widget extensions.
 *
 * @param {import('../FormValidator.js').FormValidator} validator
 * @param {object} [options]
 * @param {boolean} [options.bootstrapSelect=true]
 * @param {boolean} [options.tinymce=true]
 */
export function loadWidgetExtensions(validator, options = {}) {
  const { bootstrapSelect = true, tinymce = true } = options;

  if (bootstrapSelect) validator.use(bootstrapSelectExtension);
  if (tinymce) validator.use(tinymceExtension);

  return validator;
}
