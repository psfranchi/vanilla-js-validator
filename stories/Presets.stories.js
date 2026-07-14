import { mountValidatedForm, field, actions } from './helpers.js';

export default {
  title: 'Presets',
  parameters: {
    docs: {
      description: {
        component:
          'These stories only apply preset class names. They do not load Bootstrap or Tailwind packages.',
      },
    },
  },
};

export const DefaultPreset = {
  name: 'Default',
  render: () =>
    mountValidatedForm(`
      ${field('Email', `<input name="email" type="email" required />`)}
      ${actions()}
    `),
};

export const BootstrapClasses = {
  name: 'Bootstrap class map',
  render: () => {
    const root = mountValidatedForm(
      `
        <div class="mb-3 vj-field">
          <label class="vj-label">Email</label>
          <input name="email" type="email" required />
        </div>
        ${actions()}
      `,
      { preset: 'bootstrap' },
    );

    // Tiny visual hint without importing Bootstrap
    const style = document.createElement('style');
    style.textContent = `
      .is-invalid { border: 1px solid #dc3545; }
      .invalid-feedback { color: #dc3545; font-size: 0.875rem; }
    `;
    root.prepend(style);
    return root;
  },
};

export const TailwindClasses = {
  name: 'Tailwind class map',
  render: () => {
    const root = mountValidatedForm(
      `
        ${field('Email', `<input name="email" type="email" required />`)}
        ${actions()}
      `,
      { preset: 'tailwind' },
    );

    const style = document.createElement('style');
    style.textContent = `
      .border-red-500 { border: 1px solid #ef4444; }
      .text-red-600 { color: #dc2626; }
      .text-sm { font-size: 0.875rem; }
      .mt-1 { margin-top: 0.25rem; }
    `;
    root.prepend(style);
    return root;
  },
};
