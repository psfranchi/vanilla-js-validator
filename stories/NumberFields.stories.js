import { mountValidatedForm, field, actions } from './helpers.js';

export default {
  title: 'Fields/Numbers',
};

export const NumberMinMaxStep = {
  name: 'Number (min / max / step)',
  render: () =>
    mountValidatedForm(`
      ${field(
        'Age',
        `<input name="age" type="number" required min="18" max="99" step="1" />`,
      )}
      ${field(
        'Quantity (step 5)',
        `<input name="qty" type="number" required min="0" max="100" step="5" />`,
      )}
      ${actions()}
    `),
};

export const Range = {
  name: 'Range',
  render: () =>
    mountValidatedForm(`
      ${field('Volume', `<input name="volume" type="range" min="0" max="10" value="3" />`)}
      ${actions()}
    `),
};
