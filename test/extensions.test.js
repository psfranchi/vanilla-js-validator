import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  FormValidator,
  bootstrapSelectExtension,
  tinymceExtension,
  loadWidgetExtensions,
  createBootstrapSelectExtension,
} from '../src/index.js';
import { createFormDom } from './helpers.js';

describe('extensions', () => {
  it('bootstrapSelect highlights the toggle button and places the error after it', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <div class="bootstrap-select">
            <select class="selectpicker" name="color" required>
              <option value="">Choose</option>
              <option value="red">Red</option>
            </select>
            <button type="button">Choose</button>
          </div>
        </div>
      </form>
    `);

    const validator = new FormValidator(form)
      .use(bootstrapSelectExtension)
      .setup();

    const select = form.querySelector('select');
    const button = form.querySelector('button');

    assert.equal(validator.validateField(select), false);
    assert.ok(button.classList.contains('vj-invalid'));
    assert.equal(select.classList.contains('vj-invalid'), false);
    assert.equal(button.nextElementSibling?.getAttribute('data-vj-error'), 'true');
  });

  it('tinymce highlights the editor chrome', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <textarea class="wysiwyg" name="body" required></textarea>
          <div class="mce-tinymce"></div>
        </div>
      </form>
    `);

    const validator = new FormValidator(form, {
      extensions: [tinymceExtension],
    }).setup();

    const textarea = form.querySelector('textarea');
    const editor = form.querySelector('.mce-tinymce');

    assert.equal(validator.validateField(textarea), false);
    assert.ok(editor.classList.contains('vj-invalid'));
    assert.equal(textarea.classList.contains('vj-invalid'), false);
  });

  it('falls through to default hooks for normal fields', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <input name="email" type="email" required />
        </div>
      </form>
    `);

    const validator = new FormValidator(form)
      .use([bootstrapSelectExtension, tinymceExtension])
      .setup();

    const email = form.querySelector('[name="email"]');
    validator.validateField(email);

    assert.ok(email.classList.contains('vj-invalid'));
    assert.ok(form.querySelector('[data-vj-error]'));
  });

  it('loadWidgetExtensions mirrors the old overrides helper', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <div class="bootstrap-select">
            <select class="selectpicker" name="color" required>
              <option value="">Choose</option>
            </select>
            <button type="button">Choose</button>
          </div>
        </div>
      </form>
    `);

    const validator = new FormValidator(form);
    loadWidgetExtensions(validator);
    validator.setup();

    assert.equal(validator.extensions.length, 2);
    assert.equal(validator.validateField(form.querySelector('select')), false);
    assert.ok(form.querySelector('button').classList.contains('vj-invalid'));
  });

  it('supports custom match classes via factories', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <div class="wrapper">
            <select class="my-select" name="color" required>
              <option value="">Choose</option>
            </select>
            <button type="button">Choose</button>
          </div>
        </div>
      </form>
    `);

    const validator = new FormValidator(form, {
      extensions: [createBootstrapSelectExtension({ matchClass: 'my-select' })],
    }).setup();

    validator.validateField(form.querySelector('select'));
    assert.ok(form.querySelector('button').classList.contains('vj-invalid'));
  });

  it('supports object extensions with next() and function extensions', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <input name="name" type="text" required />
        </div>
      </form>
    `);

    let functionExtensionRan = false;

    const validator = new FormValidator(form)
      .use({
        highlightField(field, options, next) {
          field.dataset.custom = '1';
          next();
        },
      })
      .use((instance) => {
        functionExtensionRan = instance instanceof FormValidator;
      })
      .setup();

    validator.validateField(form.querySelector('[name="name"]'));
    assert.equal(functionExtensionRan, true);
    assert.equal(form.querySelector('[name="name"]').dataset.custom, '1');
    assert.ok(form.querySelector('[name="name"]').classList.contains('vj-invalid'));
  });

  it('clears selectpicker errors on valid input', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <div class="bootstrap-select">
            <select class="selectpicker" name="color" required>
              <option value="">Choose</option>
              <option value="red">Red</option>
            </select>
            <button type="button">Choose</button>
          </div>
        </div>
      </form>
    `);

    const validator = new FormValidator(form)
      .use(bootstrapSelectExtension)
      .setup();

    const select = form.querySelector('select');
    const button = form.querySelector('button');

    validator.validateField(select);
    select.value = 'red';
    assert.equal(validator.validateField(select), true);
    assert.equal(button.classList.contains('vj-invalid'), false);
    assert.equal(form.querySelector('[data-vj-error]'), null);
  });
});
