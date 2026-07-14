import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  FormValidator,
  bootstrapPreset,
  tailwindPreset,
  defaultPreset,
  resolvePreset,
  resolveOptions,
} from '../src/index.js';
import { createFormDom } from './helpers.js';

describe('presets', () => {
  it('resolvePreset accepts names and objects', () => {
    assert.deepEqual(resolvePreset('bootstrap'), { ...bootstrapPreset });
    assert.deepEqual(resolvePreset('tailwind'), { ...tailwindPreset });
    assert.deepEqual(resolvePreset('default'), { ...defaultPreset });
    assert.deepEqual(resolvePreset({ errorClass: 'x' }), { errorClass: 'x' });
  });

  it('resolvePreset rejects unknown names', () => {
    assert.throws(() => resolvePreset('material'), /Unknown preset/);
  });

  it('user options override preset values', () => {
    const options = resolveOptions({
      preset: 'bootstrap',
      errorClass: 'is-invalid custom-invalid',
      fieldContainer: '.my-field',
    });

    assert.equal(options.errorMessageClass, bootstrapPreset.errorMessageClass);
    assert.equal(options.errorClass, 'is-invalid custom-invalid');
    assert.equal(options.fieldContainer, '.my-field');
  });

  it('bootstrap preset applies Bootstrap-style classes without requiring Bootstrap', () => {
    const { form } = createFormDom(`
      <form>
        <div class="mb-3">
          <input name="name" type="text" required />
        </div>
      </form>
    `);

    const validator = new FormValidator(form, { preset: 'bootstrap' }).setup();
    const input = form.querySelector('[name="name"]');
    validator.validateField(input);

    assert.ok(input.classList.contains('is-invalid'));
    const error = form.querySelector('[data-vj-error]');
    assert.ok(error.classList.contains('invalid-feedback'));
    assert.ok(error.classList.contains('d-block'));
    assert.equal(error.tagName, 'DIV');
  });

  it('tailwind preset applies utility classes and supports multi-class strings', () => {
    const { form } = createFormDom(`
      <form>
        <div>
          <input name="name" type="text" required />
        </div>
      </form>
    `);

    const validator = new FormValidator(form, { preset: 'tailwind' }).setup();
    const input = form.querySelector('[name="name"]');
    validator.validateField(input);

    assert.ok(input.classList.contains('border-red-500'));
    assert.ok(input.classList.contains('focus:border-red-500'));
    assert.ok(input.classList.contains('focus:ring-red-500'));

    const error = form.querySelector('[data-vj-error]');
    assert.equal(error.tagName, 'P');
    assert.ok(error.classList.contains('text-red-600'));
  });

  it('accepts a preset object directly', () => {
    const { form } = createFormDom(`
      <form>
        <input name="name" type="text" required />
      </form>
    `);

    const validator = new FormValidator(form, {
      preset: {
        errorClass: 'my-error-field',
        errorMessageClass: 'my-error-msg',
        errorElement: 'small',
      },
    }).setup();

    const input = form.querySelector('[name="name"]');
    validator.validateField(input);

    assert.ok(input.classList.contains('my-error-field'));
    assert.equal(form.querySelector('[data-vj-error]')?.tagName, 'SMALL');
  });
});
