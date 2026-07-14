import { resolveOptions } from './options.js';
import { defaultHooks, refreshFieldError } from './dom/errors.js';
import { applyExtension } from './extensions/applyExtension.js';
import { collectFormFields, resolveValidationTarget } from './fields.js';

/**
 * Vanilla form validator driven by HTML constraints and configurable CSS classes.
 */
export class FormValidator {
  /**
   * @param {HTMLFormElement} form
   * @param {object} [options]
   */
  constructor(form, options = {}) {
    if (!form || String(form.tagName).toUpperCase() !== 'FORM') {
      throw new TypeError('FormValidator requires an HTMLFormElement');
    }

    const { extensions = [], ...rest } = options;

    this.form = form;
    this.options = resolveOptions(rest);
    this.extensions = [];
    this._bound = false;
    this._onBlur = this._handleBlur.bind(this);
    this._onChange = this._handleChange.bind(this);
    this._onSubmit = this._handleSubmit.bind(this);

    for (const extension of extensions) {
      this.use(extension);
    }
  }

  /**
   * Register one or more extensions (widget adapters or custom hook wrappers).
   * Object extensions wrap DOM hooks and receive `next()` for previous behavior.
   * Function extensions receive the validator instance (same idea as the old overrides helper).
   *
   * @param {object|Function|Array<object|Function>} extension
   */
  use(extension) {
    const list = Array.isArray(extension) ? extension : [extension];

    for (const item of list) {
      if (typeof item === 'function') {
        item(this);
        continue;
      }
      applyExtension(this, item);
    }

    return this;
  }

  /**
   * Attach listeners and disable native HTML validation UI.
   * Safe to call more than once — subsequent calls are no-ops while bound.
   */
  setup() {
    if (this._bound) return this;

    this.form.setAttribute('novalidate', 'true');

    if (this.options.validateOnBlur) {
      this.form.addEventListener('blur', this._onBlur, true);
    }

    if (this.options.validateOnChange) {
      this.form.addEventListener('change', this._onChange);
    }

    if (this.options.validateOnSubmit) {
      this.form.addEventListener('submit', this._onSubmit);
    }

    this._bound = true;
    return this;
  }

  /**
   * Unbind the validator from the form.
   * Removes listeners, clears error UI, resets custom validity, and restores native validation.
   *
   * @param {object} [options]
   * @param {boolean} [options.clearErrors=true] Remove highlights / error messages
   * @returns {this}
   */
  teardown({ clearErrors = true } = {}) {
    if (this._bound) {
      this.form.removeEventListener('blur', this._onBlur, true);
      this.form.removeEventListener('change', this._onChange);
      this.form.removeEventListener('submit', this._onSubmit);
      this.form.removeAttribute('novalidate');
      this._bound = false;
    }

    if (clearErrors) {
      this.clearErrors();
    }

    return this;
  }

  /**
   * Remove error UI and custom validity from all fields without unbinding listeners.
   * @returns {this}
   */
  clearErrors() {
    const hooks = this._hooks();
    const ctxOptions = this.options;

    for (const field of this.formFields) {
      field.setCustomValidity('');
      const ctx = { field, options: ctxOptions };
      hooks.unhighlightField(field, ctxOptions, ctx);
      hooks.removeErrorMessage(field, ctxOptions, ctx);
    }

    return this;
  }

  /** Whether `setup()` is currently active. */
  get isBound() {
    return this._bound;
  }

  /**
   * Validate every eligible field.
   * @returns {boolean}
   */
  validateForm() {
    let isValid = true;

    for (const field of this.formFields) {
      if (!this.validateField(field)) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Validate a single field and update error UI.
   * Radio inputs are resolved to their group representative.
   * @param {HTMLElement} field
   * @returns {boolean}
   */
  validateField(field) {
    const target = resolveValidationTarget(field);

    if (!this.shouldValidateField(target)) {
      return true;
    }

    target.setCustomValidity('');

    let isValid = true;

    for (const validator of Object.values(this.options.validators)) {
      const result = validator(target, this.options);
      if (result !== true) {
        target.setCustomValidity(result || 'Invalid field');
        isValid = false;
        break;
      }
    }

    if (isValid && !target.validity.valid) {
      isValid = false;
    }

    refreshFieldError(target, isValid, this.options, this._hooks());
    return isValid;
  }

  /**
   * @param {HTMLElement} field
   * @returns {boolean}
   */
  shouldValidateField(field) {
    return !field.disabled && field.matches(this.options.fieldSelector);
  }

  /** @returns {HTMLElement[]} */
  get formFields() {
    return collectFormFields(this.form, this.options.fieldSelector);
  }

  /** @returns {HTMLElement|undefined} */
  get firstInvalidField() {
    return this.formFields.find((field) => !field.validity.valid);
  }

  _hooks() {
    const { options } = this;
    return {
      highlightField: options.highlightField || defaultHooks.highlightField,
      unhighlightField:
        options.unhighlightField || defaultHooks.unhighlightField,
      showErrorMessage:
        options.showErrorMessage || defaultHooks.showErrorMessage,
      removeErrorMessage:
        options.removeErrorMessage || defaultHooks.removeErrorMessage,
    };
  }

  _handleBlur(event) {
    this.validateField(event.target);
  }

  _handleChange(event) {
    this.validateField(event.target);
  }

  _handleSubmit(event) {
    if (!this.validateForm()) {
      event.preventDefault();
      this.firstInvalidField?.focus();
    }
  }
}
