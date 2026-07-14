import { mountValidatedForm, field, actions } from './helpers.js';

export default {
  title: 'Fields/Text & contact',
};

export const TextPasswordSearch = {
  name: 'Text / password / search',
  render: () =>
    mountValidatedForm(`
      ${field('Full name', `<input name="name" type="text" required minlength="2" />`)}
      ${field('Password', `<input name="password" type="password" required minlength="8" />`)}
      ${field('Search', `<input name="q" type="search" required />`)}
      ${actions()}
    `),
};

export const EmailUrlTel = {
  name: 'Email / URL / tel',
  render: () =>
    mountValidatedForm(`
      ${field('Email', `<input name="email" type="email" required />`)}
      ${field('Website', `<input name="website" type="url" required />`)}
      ${field(
        'Phone',
        `<input name="phone" type="tel" required pattern="[0-9\\-\\+\\s]{7,}" title="Use digits and phone symbols" />`,
      )}
      ${actions()}
    `),
};

export const PatternAndLength = {
  name: 'Pattern & length',
  render: () =>
    mountValidatedForm(`
      ${field(
        'Username',
        `<input name="username" type="text" required pattern="[a-z0-9_]{3,12}" minlength="3" maxlength="12" />`,
      )}
      ${actions()}
    `),
};
