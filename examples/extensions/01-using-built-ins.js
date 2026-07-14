/**
 * Example: use the built-in widget extensions.
 *
 * Use these when the form has Bootstrap Select (`.selectpicker`) and/or
 * TinyMCE / markdown editors (`.wysiwyg`).
 *
 * Pick ONE of the options below.
 */

import {
  FormValidator,
  bootstrapSelectExtension,
  tinymceExtension,
  loadWidgetExtensions,
} from '../../src/index.js';

const form = document.querySelector('#campaign-form');

// ---------------------------------------------------------------------------
// Option A — chain .use()
// ---------------------------------------------------------------------------
new FormValidator(form, { preset: 'bootstrap' })
  .use(bootstrapSelectExtension)
  .use(tinymceExtension)
  .setup();

// ---------------------------------------------------------------------------
// Option B — pass extensions in the constructor
// ---------------------------------------------------------------------------
// new FormValidator(form, {
//   preset: 'bootstrap',
//   extensions: [bootstrapSelectExtension, tinymceExtension],
// }).setup();

// ---------------------------------------------------------------------------
// Option C — helper similar to the old loadValidatorOverrides()
// ---------------------------------------------------------------------------
// const validator = new FormValidator(form, { preset: 'bootstrap' });
// loadWidgetExtensions(validator);
// validator.setup();

// ---------------------------------------------------------------------------
// Option D — only Bootstrap Select (skip TinyMCE)
// ---------------------------------------------------------------------------
// const validator = new FormValidator(form, { preset: 'bootstrap' });
// loadWidgetExtensions(validator, { tinymce: false });
// validator.setup();
