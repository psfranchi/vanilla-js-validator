/**
 * Escape a value for use inside a CSS attribute selector.
 * @param {string} value
 */
function cssEscape(value) {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * @param {HTMLInputElement} field
 * @returns {HTMLInputElement[]}
 */
export function getRadioGroup(field) {
  if (!field?.form || !field.name) return field ? [field] : [];

  return Array.from(
    field.form.querySelectorAll(
      `input[type="radio"][name="${cssEscape(field.name)}"]`,
    ),
  );
}

/**
 * Checkboxes that share a `name` (e.g. interests[]) form a group.
 * @param {HTMLInputElement} field
 * @returns {HTMLInputElement[]}
 */
export function getCheckboxGroup(field) {
  if (!field?.form || !field.name || field.type !== 'checkbox') {
    return field ? [field] : [];
  }

  return Array.from(
    field.form.querySelectorAll(
      `input[type="checkbox"][name="${cssEscape(field.name)}"]`,
    ),
  );
}

/**
 * Prefer a required radio as the group representative; otherwise the first.
 * @param {HTMLInputElement} field
 * @returns {HTMLInputElement}
 */
export function getRadioGroupRepresentative(field) {
  const group = getRadioGroup(field);
  if (!group.length) return field;
  return group.find((radio) => radio.required) || group[0];
}

/**
 * First checkbox in a same-name group (used for “at least one” style rules).
 * @param {HTMLInputElement} field
 * @returns {HTMLInputElement}
 */
export function getCheckboxGroupRepresentative(field) {
  const group = getCheckboxGroup(field);
  if (!group.length) return field;
  return group.find((box) => box.required) || group[0];
}

/**
 * Where to put an error message for a field.
 * Choice controls place the message under the group / field wrapper —
 * never between an input and its label text.
 *
 * @param {HTMLElement} field
 * @param {object} options
 * @returns {{ mode: 'append'|'after', target: Element }}
 */
export function getErrorPlacement(field, options = {}) {
  if (field.type === 'radio' || field.type === 'checkbox') {
    if (options.fieldContainer) {
      const container = field.closest(options.fieldContainer);
      if (container) {
        return { mode: 'append', target: container };
      }
    }

    if (field.type === 'radio') {
      const group = getRadioGroup(field);
      const last = group[group.length - 1] || field;
      const lastLabel = last.closest('label');
      if (lastLabel) {
        return { mode: 'after', target: lastLabel };
      }

      const list = last.parentElement;
      if (list) {
        return { mode: 'append', target: list };
      }
    }

    if (field.type === 'checkbox') {
      const group = getCheckboxGroup(field);
      if (group.length > 1) {
        const last = group[group.length - 1];
        const lastLabel = last.closest('label');
        if (lastLabel) {
          return { mode: 'after', target: lastLabel };
        }
      }
    }

    const label = field.closest('label');
    if (label) {
      return { mode: 'after', target: label };
    }
  }

  return { mode: 'after', target: field };
}

/**
 * Collect unique fields to validate.
 * Radio and same-name checkbox groups collapse to one representative.
 * @param {HTMLFormElement} form
 * @param {string} fieldSelector
 * @returns {HTMLElement[]}
 */
export function collectFormFields(form, fieldSelector) {
  const nodes = Array.from(form.querySelectorAll(fieldSelector));
  const seenRadioNames = new Set();
  const seenCheckboxNames = new Set();

  return nodes.filter((field) => {
    if (field.type === 'radio') {
      if (!field.name || seenRadioNames.has(field.name)) return false;
      seenRadioNames.add(field.name);
      return true;
    }

    if (field.type === 'checkbox') {
      if (!field.name || seenCheckboxNames.has(field.name)) return false;
      seenCheckboxNames.add(field.name);
      return true;
    }

    return true;
  });
}

/**
 * Normalize the field to validate (radio/checkbox group → representative).
 * @param {HTMLElement} field
 * @returns {HTMLElement}
 */
export function resolveValidationTarget(field) {
  if (field?.type === 'radio') {
    return getRadioGroupRepresentative(field);
  }

  if (field?.type === 'checkbox') {
    const group = getCheckboxGroup(field);
    if (group.length > 1) {
      return getCheckboxGroupRepresentative(field);
    }
  }

  return field;
}
