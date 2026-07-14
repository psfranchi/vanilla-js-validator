import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { FormValidator } from '../src/index.js';
import { createFormDom } from './helpers.js';

describe('FormValidator', () => {
  /** @type {HTMLFormElement} */
  let form;
  /** @type {Document} */
  let document;

  beforeEach(() => {
    ({ form, document } = createFormDom(`
      <form>
        <div class="vj-field">
          <input name="email" type="email" required />
        </div>
        <div class="vj-field">
          <input name="age" type="number" min="18" max="99" />
        </div>
        <button type="submit">Send</button>
      </form>
    `));
  });

  it('requires a form element', () => {
    assert.throws(() => new FormValidator(null), /HTMLFormElement/);
    assert.throws(() => new FormValidator(document.createElement('div')), /HTMLFormElement/);
  });

  it('setup disables native validation and attaches listeners', () => {
    const validator = new FormValidator(form).setup();
    assert.equal(form.getAttribute('novalidate'), 'true');
    assert.equal(validator.isBound, true);
    validator.teardown();
    assert.equal(validator.isBound, false);
    assert.equal(form.hasAttribute('novalidate'), false);
  });

  it('teardown unbinds listeners and clears error UI', () => {
    const validator = new FormValidator(form).setup();
    const email = form.querySelector('[name="email"]');

    validator.validateField(email);
    assert.ok(email.classList.contains('vj-invalid'));
    assert.ok(form.querySelector('[data-vj-error]'));

    validator.teardown();

    assert.equal(validator.isBound, false);
    assert.equal(email.classList.contains('vj-invalid'), false);
    assert.equal(form.querySelector('[data-vj-error]'), null);
    assert.equal(form.hasAttribute('novalidate'), false);

    // After teardown, blur / submit no longer validate
    email.dispatchEvent(
      new form.ownerDocument.defaultView.FocusEvent('blur', { bubbles: true }),
    );
    assert.equal(form.querySelector('[data-vj-error]'), null);
  });

  it('clearErrors removes UI without unbinding', () => {
    const validator = new FormValidator(form).setup();
    const email = form.querySelector('[name="email"]');

    validator.validateField(email);
    validator.clearErrors();

    assert.equal(validator.isBound, true);
    assert.equal(email.classList.contains('vj-invalid'), false);
    assert.equal(form.querySelector('[data-vj-error]'), null);
  });

  it('teardown can keep error UI when requested', () => {
    const validator = new FormValidator(form).setup();
    const email = form.querySelector('[name="email"]');

    validator.validateField(email);
    validator.teardown({ clearErrors: false });

    assert.equal(validator.isBound, false);
    assert.ok(email.classList.contains('vj-invalid'));
  });

  it('setup is idempotent and can be called again after teardown', () => {
    const validator = new FormValidator(form).setup().setup();
    assert.equal(validator.isBound, true);

    validator.teardown();
    validator.setup();

    assert.equal(validator.isBound, true);
    assert.equal(form.getAttribute('novalidate'), 'true');

    const email = form.querySelector('[name="email"]');
    email.dispatchEvent(
      new form.ownerDocument.defaultView.FocusEvent('blur', { bubbles: true }),
    );
    assert.ok(form.querySelector('[data-vj-error]'));
  });

  it('marks required empty fields invalid and shows an error message', () => {
    const validator = new FormValidator(form).setup();
    const email = form.querySelector('[name="email"]');

    assert.equal(validator.validateField(email), false);
    assert.ok(email.classList.contains('vj-invalid'));
    assert.equal(
      form.querySelector('[data-vj-error]')?.textContent,
      'This field is required',
    );
  });

  it('clears errors when a field becomes valid', () => {
    const validator = new FormValidator(form).setup();
    const email = form.querySelector('[name="email"]');

    validator.validateField(email);
    email.value = 'user@example.com';
    assert.equal(validator.validateField(email), true);
    assert.equal(email.classList.contains('vj-invalid'), false);
    assert.equal(form.querySelector('[data-vj-error]'), null);
  });

  it('validateForm returns false when any field is invalid', () => {
    const validator = new FormValidator(form).setup();
    assert.equal(validator.validateForm(), false);
  });

  it('validateForm returns true when all fields are valid', () => {
    const validator = new FormValidator(form).setup();
    form.querySelector('[name="email"]').value = 'user@example.com';
    form.querySelector('[name="age"]').value = '21';
    assert.equal(validator.validateForm(), true);
  });

  it('enforces min/max constraints with custom messages', () => {
    const validator = new FormValidator(form, {
      messages: {
        min: (field) => `At least ${field.min}`,
      },
    }).setup();

    const age = form.querySelector('[name="age"]');
    age.value = '10';
    assert.equal(validator.validateField(age), false);
    assert.equal(form.querySelector('[data-vj-error]')?.textContent, 'At least 18');
  });

  it('allows a custom fieldContainer selector', () => {
    ({ form } = createFormDom(`
      <form>
        <div class="custom-wrap">
          <input name="name" type="text" required />
        </div>
      </form>
    `));

    const validator = new FormValidator(form, {
      fieldContainer: '.custom-wrap',
    }).setup();

    const name = form.querySelector('[name="name"]');
    validator.validateField(name);

    assert.ok(name.closest('.custom-wrap').querySelector('[data-vj-error]'));
  });

  it('skips disabled fields', () => {
    const email = form.querySelector('[name="email"]');
    email.disabled = true;

    const validator = new FormValidator(form).setup();
    assert.equal(validator.validateField(email), true);
    assert.equal(form.querySelector('[data-vj-error]'), null);
  });

  it('prevents submit when invalid and focuses first invalid field', () => {
    const validator = new FormValidator(form).setup();
    const email = form.querySelector('[name="email"]');
    let focused = false;
    email.focus = () => {
      focused = true;
    };

    const event = new form.ownerDocument.defaultView.Event('submit', {
      cancelable: true,
      bubbles: true,
    });

    form.dispatchEvent(event);

    assert.equal(event.defaultPrevented, true);
    assert.equal(focused, true);
    assert.ok(email.classList.contains('vj-invalid'));
  });

  it('supports custom validators', () => {
    const validator = new FormValidator(form, {
      validators: {
        mustBeExample(field) {
          if (field.name === 'email' && field.value && !field.value.endsWith('@example.com')) {
            return 'Use an @example.com address';
          }
          return true;
        },
      },
    }).setup();

    const email = form.querySelector('[name="email"]');
    email.value = 'user@gmail.com';
    assert.equal(validator.validateField(email), false);
    assert.equal(
      form.querySelector('[data-vj-error]')?.textContent,
      'Use an @example.com address',
    );
  });

  it('honors validateOnBlur / validateOnSubmit flags', () => {
    const validator = new FormValidator(form, {
      validateOnBlur: false,
      validateOnSubmit: false,
    }).setup();

    const email = form.querySelector('[name="email"]');
    email.dispatchEvent(
      new form.ownerDocument.defaultView.FocusEvent('blur', { bubbles: true }),
    );
    assert.equal(form.querySelector('[data-vj-error]'), null);

    const submitEvent = new form.ownerDocument.defaultView.Event('submit', {
      cancelable: true,
      bubbles: true,
    });
    form.dispatchEvent(submitEvent);
    assert.equal(submitEvent.defaultPrevented, false);

    validator.teardown();
  });
});
