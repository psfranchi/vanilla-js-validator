import { mountValidatedForm, field, actions } from './helpers.js';

export default {
  title: 'Fields/Select & textarea',
};

export const NativeSelect = {
  name: 'Select',
  render: () =>
    mountValidatedForm(`
      ${field(
        'Country',
        `<select name="country" required>
          <option value="">Choose…</option>
          <option value="ar">Argentina</option>
          <option value="uy">Uruguay</option>
          <option value="cl">Chile</option>
        </select>`,
      )}
      ${actions()}
    `),
};

export const Textarea = {
  name: 'Textarea',
  render: () =>
    mountValidatedForm(`
      ${field(
        'Bio',
        `<textarea name="bio" required minlength="10" maxlength="120" placeholder="At least 10 characters"></textarea>`,
      )}
      ${actions()}
    `),
};
