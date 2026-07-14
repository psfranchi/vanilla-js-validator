import { FormValidator } from '../src/index.js';

/**
 * Mount a full HTML form and attach FormValidator.
 * @param {string} formHtml inner HTML for the <form> (or a full <form>...</form>)
 * @param {object} [options] FormValidator options
 */
export function mountValidatedForm(formHtml, options = {}) {
  const root = document.createElement('div');
  root.className = 'vj-demo';

  const trimmed = formHtml.trim();
  root.innerHTML = trimmed.startsWith('<form')
    ? trimmed
    : `<form novalidate>${trimmed}</form>`;

  const form = root.querySelector('form');
  const validator = new FormValidator(form, {
    fieldContainer: '.vj-field',
    ...options,
  }).setup();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  root._validator = validator;
  return root;
}

export function field(label, controlHtml) {
  return `
    <div class="vj-field">
      <label class="vj-label">${label}</label>
      ${controlHtml}
    </div>
  `;
}

export function actions(submitLabel = 'Submit') {
  return `
    <div class="vj-actions">
      <button type="submit">${submitLabel}</button>
    </div>
  `;
}
