export { FormValidator } from './FormValidator.js';
export {
  defaultPreset,
  bootstrapPreset,
  tailwindPreset,
  presets,
  resolvePreset,
} from './presets/index.js';
export { DEFAULT_FIELD_SELECTOR, resolveOptions } from './options.js';
export { builtInValidators } from './validators.js';
export {
  applyExtension,
  bootstrapSelectExtension,
  createBootstrapSelectExtension,
  tinymceExtension,
  createTinymceExtension,
  loadWidgetExtensions,
} from './extensions/index.js';

// Helpers for authoring custom extensions
export { addClasses, removeClasses } from './dom/classes.js';
export {
  createErrorElement,
  insertErrorAfter,
  getFieldContainer,
  defaultHooks,
} from './dom/errors.js';
export {
  getRadioGroup,
  getRadioGroupRepresentative,
  getCheckboxGroup,
  getCheckboxGroupRepresentative,
  getErrorPlacement,
  collectFormFields,
} from './fields.js';
export { placeErrorMessage } from './dom/errors.js';
