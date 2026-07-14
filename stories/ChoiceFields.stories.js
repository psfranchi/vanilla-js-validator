import { mountValidatedForm, field, actions } from './helpers.js';

export default {
  title: 'Fields/Choices',
};

export const RequiredCheckbox = {
  name: 'Checkbox (required)',
  render: () =>
    mountValidatedForm(`
      <div class="vj-field">
        <label class="vj-choice">
          <input type="checkbox" name="terms" required />
          I accept the terms
        </label>
      </div>
      ${actions()}
    `),
};

export const RequiredRadioGroup = {
  name: 'Radio group (required)',
  render: () =>
    mountValidatedForm(`
      <div class="vj-field">
        <span class="vj-label">Size</span>
        <div class="vj-choice-list">
          <label class="vj-choice">
            <input type="radio" name="size" value="s" required /> S
          </label>
          <label class="vj-choice">
            <input type="radio" name="size" value="m" /> M
          </label>
          <label class="vj-choice">
            <input type="radio" name="size" value="l" /> L
          </label>
        </div>
      </div>
      ${actions()}
    `),
};

export const CheckboxGroupCustomRule = {
  name: 'Checkbox group (custom: at least one)',
  render: () =>
    mountValidatedForm(
      `
        <div class="vj-field">
          <span class="vj-label">Interests (pick at least one)</span>
          <div class="vj-choice-list">
            <label class="vj-choice"><input type="checkbox" name="interest" value="js" /> JS</label>
            <label class="vj-choice"><input type="checkbox" name="interest" value="css" /> CSS</label>
            <label class="vj-choice"><input type="checkbox" name="interest" value="a11y" /> A11y</label>
          </div>
        </div>
        ${actions()}
      `,
      {
        validators: {
          // Same-name checkboxes validate as one group (like radios).
          // Checking any option revalidates the whole group.
          atLeastOneInterest(field) {
            if (field.name !== 'interest') return true;

            const checked = field.form.querySelectorAll(
              'input[name="interest"]:checked',
            );
            return checked.length > 0 ? true : 'Pick at least one interest';
          },
        },
      },
    ),
};
