import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FormValidator } from '../src/index.js';
import { createFormDom } from './helpers.js';

describe('choice fields (radio / checkbox / file)', () => {
  it('validates a required radio group once and places the error under the group', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <div class="vj-choice-list">
            <label><input type="radio" name="size" value="s" required /> S</label>
            <label><input type="radio" name="size" value="m" /> M</label>
            <label><input type="radio" name="size" value="l" /> L</label>
          </div>
        </div>
      </form>
    `);

    const validator = new FormValidator(form, { fieldContainer: '.vj-field' }).setup();
    const radios = form.querySelectorAll('[name="size"]');
    const field = form.querySelector('.vj-field');

    assert.equal(validator.formFields.length, 1);
    assert.equal(validator.validateForm(), false);
    assert.equal(form.querySelectorAll('[data-vj-error]').length, 1);

    const error = field.querySelector('[data-vj-error]');
    assert.ok(error);
    assert.equal(error.parentElement, field);
    assert.equal(field.lastElementChild, error);
    // Message is not injected between a radio and its label text
    assert.equal(radios[2].nextElementSibling?.getAttribute('data-vj-error'), undefined);
    assert.ok([...radios].every((radio) => radio.classList.contains('vj-invalid')));

    radios[1].checked = true;
    assert.equal(validator.validateField(radios[1]), true);
    assert.equal(form.querySelector('[data-vj-error]'), null);
  });

  it('validates a required checkbox and places the error under the field group', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <label>
            <input type="checkbox" name="terms" required />
            Accept terms
          </label>
        </div>
      </form>
    `);

    const validator = new FormValidator(form).setup();
    const checkbox = form.querySelector('[name="terms"]');
    const field = form.querySelector('.vj-field');
    const label = checkbox.closest('label');

    assert.equal(validator.validateField(checkbox), false);
    assert.ok(checkbox.classList.contains('vj-invalid'));

    const error = field.querySelector('[data-vj-error]');
    assert.equal(error?.parentElement, field);
    assert.equal(field.lastElementChild, error);
    // Not injected between the checkbox and "Accept terms"
    assert.notEqual(checkbox.nextSibling, error);
    assert.ok(label.textContent.includes('Accept terms'));

    checkbox.checked = true;
    assert.equal(validator.validateField(checkbox), true);
  });

  it('validates a required file input', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <input type="file" name="resume" required />
        </div>
      </form>
    `);

    const validator = new FormValidator(form).setup();
    const file = form.querySelector('[name="resume"]');

    assert.equal(validator.validateField(file), false);
    assert.ok(form.querySelector('[data-vj-error]'));
  });

  it('revalidates radios and checkboxes on change', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <input type="checkbox" name="newsletter" required />
        </div>
      </form>
    `);

    const validator = new FormValidator(form).setup();
    const checkbox = form.querySelector('[name="newsletter"]');

    checkbox.dispatchEvent(
      new form.ownerDocument.defaultView.Event('change', { bubbles: true }),
    );
    assert.ok(checkbox.classList.contains('vj-invalid'));

    checkbox.checked = true;
    checkbox.dispatchEvent(
      new form.ownerDocument.defaultView.Event('change', { bubbles: true }),
    );
    assert.equal(checkbox.classList.contains('vj-invalid'), false);

    validator.teardown();
  });

  it('treats same-name checkboxes as a group for at-least-one rules', () => {
    const { form } = createFormDom(`
      <form>
        <div class="vj-field">
          <label><input type="checkbox" name="interest" value="js" /> JS</label>
          <label><input type="checkbox" name="interest" value="css" /> CSS</label>
          <label><input type="checkbox" name="interest" value="a11y" /> A11y</label>
        </div>
      </form>
    `);

    const validator = new FormValidator(form, {
      fieldContainer: '.vj-field',
      validators: {
        atLeastOneInterest(field) {
          if (field.name !== 'interest') return true;
          const checked = field.form.querySelectorAll(
            'input[name="interest"]:checked',
          );
          return checked.length > 0 ? true : 'Pick at least one interest';
        },
      },
    }).setup();

    const boxes = [...form.querySelectorAll('[name="interest"]')];

    assert.equal(validator.formFields.length, 1);
    assert.equal(validator.validateForm(), false);
    assert.ok(boxes.every((box) => box.classList.contains('vj-invalid')));
    assert.equal(
      form.querySelector('[data-vj-error]')?.textContent,
      'Pick at least one interest',
    );

    // Checking a non-first box must clear the whole group
    boxes[1].checked = true;
    boxes[1].dispatchEvent(
      new form.ownerDocument.defaultView.Event('change', { bubbles: true }),
    );

    assert.equal(validator.validateField(boxes[1]), true);
    assert.ok(boxes.every((box) => !box.classList.contains('vj-invalid')));
    assert.equal(form.querySelector('[data-vj-error]'), null);

    validator.teardown();
  });
});
