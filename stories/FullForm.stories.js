import { mountValidatedForm, field, actions } from './helpers.js';

export default {
  title: 'Fields/Full form',
};

export const SignupForm = {
  name: 'Signup form',
  render: () =>
    mountValidatedForm(`
      ${field('Name', `<input name="name" type="text" required />`)}
      ${field('Email', `<input name="email" type="email" required />`)}
      ${field('Age', `<input name="age" type="number" required min="18" max="99" />`)}
      ${field(
        'Plan',
        `<select name="plan" required>
          <option value="">Choose…</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>`,
      )}
      <div class="vj-field">
        <span class="vj-label">Role</span>
        <div class="vj-choice-list">
          <label class="vj-choice"><input type="radio" name="role" value="dev" required /> Developer</label>
          <label class="vj-choice"><input type="radio" name="role" value="design" /> Designer</label>
        </div>
      </div>
      <div class="vj-field">
        <label class="vj-choice">
          <input type="checkbox" name="terms" required />
          Accept terms
        </label>
      </div>
      ${actions('Create account')}
    `),
};
