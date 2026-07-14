import { mountValidatedForm, field, actions } from './helpers.js';

export default {
  title: 'Fields/Other',
};

export const FileInput = {
  name: 'File (required)',
  render: () =>
    mountValidatedForm(`
      ${field('Resume', `<input name="resume" type="file" required />`)}
      ${actions()}
    `),
};

export const ColorInput = {
  name: 'Color',
  render: () =>
    mountValidatedForm(`
      ${field('Brand color', `<input name="brand" type="color" value="#e31c3d" />`)}
      ${actions()}
    `),
};
