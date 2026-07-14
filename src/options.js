import { resolvePreset } from './presets/index.js';
import { builtInValidators } from './validators.js';

export const DEFAULT_FIELD_SELECTOR = [
  "input[type='text']",
  "input[type='password']",
  "input[type='number']",
  "input[type='search']",
  "input[type='tel']",
  "input[type='url']",
  "input[type='email']",
  "input[type='datetime']",
  "input[type='datetime-local']",
  "input[type='date']",
  "input[type='month']",
  "input[type='week']",
  "input[type='time']",
  "input[type='range']",
  "input[type='color']",
  "input[type='file']",
  "input[type='checkbox']",
  "input[type='radio']",
  'select',
  'textarea',
].join(', ');

const BASE_OPTIONS = {
  fieldSelector: DEFAULT_FIELD_SELECTOR,
  fieldContainer: null,
  errorClass: 'vj-invalid',
  errorMessageClass: 'vj-error',
  errorElement: 'span',
  validateOnBlur: true,
  validateOnChange: true,
  validateOnSubmit: true,
  messages: {},
  validators: {},
  highlightField: null,
  unhighlightField: null,
  showErrorMessage: null,
  removeErrorMessage: null,
};

/**
 * Merge preset + user options. User options win.
 * @param {object} userOptions
 */
export function resolveOptions(userOptions = {}) {
  const { preset, validators: userValidators, messages: userMessages, ...rest } =
    userOptions;

  const fromPreset = resolvePreset(preset);

  return {
    ...BASE_OPTIONS,
    ...fromPreset,
    ...rest,
    messages: {
      ...BASE_OPTIONS.messages,
      ...(fromPreset.messages || {}),
      ...(userMessages || {}),
    },
    validators: {
      ...builtInValidators,
      ...(fromPreset.validators || {}),
      ...(userValidators || {}),
    },
  };
}
