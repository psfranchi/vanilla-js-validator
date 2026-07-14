# vanilla-js-validator

Lightweight, class-driven form validation for **vanilla JavaScript**.

Inspired by the ergonomics of jQuery Validation, but with no jQuery — just HTML constraints, a small API, and configurable CSS classes for error look-and-feel.

- Zero runtime dependencies
- Works with the native [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)
- Configurable field / error class names
- Optional **Bootstrap** and **Tailwind** presets (class maps only — those libraries are never required)
- **Extensions** for custom widgets (Bootstrap Select, TinyMCE, or your own)

## Requirements

- **Browsers:** modern evergreen browsers (ES modules)
- **Node.js 20+** to install / run tests (`.nvmrc` pins **24** Active LTS for local Storybook/dev)

## Install

```bash
npm install vanilla-js-validator
```

## Quick start

```html
<form id="signup">
  <div class="vj-field">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required />
  </div>

  <div class="vj-field">
    <label for="age">Age</label>
    <input id="age" name="age" type="number" min="18" max="99" />
  </div>

  <button type="submit">Create account</button>
</form>

<link rel="stylesheet" href="node_modules/vanilla-js-validator/styles/default.css" />

<script type="module">
  import { FormValidator } from 'vanilla-js-validator';

  const form = document.querySelector('#signup');
  new FormValidator(form).setup();
</script>
```

By default the library:

1. Sets `novalidate` on the form
2. Validates on **blur**, **change**, and **submit**
3. Applies `.vj-invalid` to invalid fields
4. Inserts a `.vj-error` message element after the field

## Storybook (HTML field demos)

Interactive full-form demos for native HTML controls live in Storybook — not under a plain `examples/` folder.

```bash
npm run storybook
```

| Story group | Components |
|-------------|------------|
| Text & contact | `text`, `password`, `search`, `email`, `url`, `tel` |
| Numbers | `number`, `range` |
| Dates & time | `date`, `time`, `datetime-local`, `month`, `week` |
| Choices | `checkbox`, `radio` groups |
| Select & textarea | `select`, `textarea` |
| Other | `file`, `color` |
| Full form | mixed controls together |
| Presets | default / Bootstrap / Tailwind **class maps only** |

**Extensions** (Bootstrap Select, TinyMCE, custom widgets) stay in [`examples/extensions/`](./examples/extensions/) as code samples so Storybook does not pull those dependencies.

## Supported HTML components

| Control | Built-in support | Notes |
|---------|------------------|-------|
| text / password / search | yes | `required`, `minlength`, `maxlength`, `pattern` |
| email / url / tel | yes | `type` / `pattern` |
| number / range | yes | `min`, `max`, `step`, `badInput` |
| date / time / datetime-local / month / week | yes | |
| color | yes | |
| file | yes | `required` |
| checkbox | yes | single required checkbox |
| radio | yes | same `name` = one group, one error |
| select / textarea | yes | |

For radios and checkboxes the library:

- highlights the control(s) with `errorClass`
- shows **one message under the field group** (`.vj-field` / `fieldContainer`), not between the input and its label text
- treats inputs that share the same `name` as **one group** (validate / clear together)

This matches the usual jQuery Validate approach (`errorPlacement` after the group) and Bootstrap’s group-level feedback pattern.

Checkbox groups that need “at least one checked” are not a native HTML constraint — use a **custom validator** on the shared `name` (see the Storybook Choices story).

### Built-in validators

`required`, `type`, `pattern`, `min`, `max`, `minLength`, `maxLength`, `step`, `badInput`

## Presets (Bootstrap / Tailwind)

Presets only supply class names and element types. **They do not install or import Bootstrap or Tailwind.** If you already use one of those on the page, pass the matching preset so error UI matches your stack.

### Bootstrap

```js
import { FormValidator } from 'vanilla-js-validator';

new FormValidator(form, { preset: 'bootstrap' }).setup();
```

Applies:

| Option | Value |
|--------|--------|
| `errorClass` | `is-invalid` |
| `errorMessageClass` | `invalid-feedback d-block` |
| `errorElement` | `div` |
| `fieldContainer` | `.mb-3` |

### Tailwind

```js
import { FormValidator } from 'vanilla-js-validator';

new FormValidator(form, { preset: 'tailwind' }).setup();
```

Applies:

| Option | Value |
|--------|--------|
| `errorClass` | `border-red-500 focus:border-red-500 focus:ring-red-500` |
| `errorMessageClass` | `mt-1 text-sm text-red-600` |
| `errorElement` | `p` |

You can also import the preset objects and merge your own overrides:

```js
import { FormValidator, bootstrapPreset } from 'vanilla-js-validator';

new FormValidator(form, {
  ...bootstrapPreset,
  fieldContainer: '.form-group',
  errorClass: 'is-invalid my-field-error',
}).setup();

// or
new FormValidator(form, {
  preset: bootstrapPreset,
  messages: { required: 'Required' },
}).setup();
```

## Configuration

```js
new FormValidator(form, {
  // 'default' | 'bootstrap' | 'tailwind' | custom object
  preset: 'default',

  // CSS selector for fields to validate
  fieldSelector: "input[type='text'], input[type='email'], select, textarea, ...",

  // closest() selector used when removing error nodes (null = parentElement)
  fieldContainer: '.vj-field',

  // Classes applied to the invalid field (space-separated OK for Tailwind)
  errorClass: 'vj-invalid',

  // Classes applied to the injected error message element
  errorMessageClass: 'vj-error',

  // Tag name for the error message element
  errorElement: 'span',

  validateOnBlur: true,
  validateOnChange: true, // useful for radios / checkboxes / selects
  validateOnSubmit: true,

  // Override built-in messages (string or (field) => string)
  messages: {
    required: 'This field is required',
    type: 'Please enter a valid value',
    pattern: 'Please match the requested format',
    min: (field) => `Min value is ${field.min}.`,
    max: (field) => `Max value is ${field.max}.`,
    minLength: (field) => `Please use at least ${field.minLength} characters.`,
    maxLength: (field) => `Please use no more than ${field.maxLength} characters.`,
    step: 'Please enter a valid value',
    badInput: 'Please enter a valid value',
  },

  // Add or replace validators (see below)
  validators: {},

  // Optional DOM hooks for custom widgets
  highlightField: null,
  unhighlightField: null,
  showErrorMessage: null,
  removeErrorMessage: null,
});
```

User options always win over the selected preset.

### Custom validators

Each validator receives `(field, options)` and must return `true` or an error message string:

```js
new FormValidator(form, {
  validators: {
    mustMatch(field) {
      if (field.name === 'confirm' && field.value !== form.password.value) {
        return 'Passwords must match';
      }
      return true;
    },
  },
}).setup();
```

Built-ins already cover: `required`, `type`, `pattern`, `min`, `max`, `minLength`, `maxLength`, `step`, `badInput`.

## Extensions

Complex widgets (Bootstrap Select, TinyMCE, input groups, custom selects, etc.) often hide the native field behind extra DOM. Extensions let you override **where** errors are shown and **what** gets the error class, without forking the validator.

Copy-paste examples: [`examples/extensions/`](./examples/extensions/).

### When do you need an extension?

| Situation | Use |
|-----------|-----|
| Normal `<input>` / `<select>` / `<textarea>` | No extension — defaults are enough |
| Bootstrap Select (hidden `<select>` + toggle button) | `bootstrapSelectExtension` |
| TinyMCE / markdown editor | `tinymceExtension` |
| Your own widget (input group, fancy select, …) | Write a small custom extension |

### Using the built-in extensions

```js
import {
  FormValidator,
  bootstrapSelectExtension,
  tinymceExtension,
  loadWidgetExtensions,
} from 'vanilla-js-validator';

new FormValidator(form, { preset: 'bootstrap' })
  .use(bootstrapSelectExtension)
  .use(tinymceExtension)
  .setup();

// Same via constructor
new FormValidator(form, {
  preset: 'bootstrap',
  extensions: [bootstrapSelectExtension, tinymceExtension],
}).setup();

// Helper similar to the old loadValidatorOverrides()
const validator = new FormValidator(form, { preset: 'bootstrap' });
loadWidgetExtensions(validator);
validator.setup();
```

| Extension | Matches | Behavior |
|-----------|---------|----------|
| `bootstrapSelectExtension` | `.selectpicker` | Highlights the toggle `button`, places the error after it |
| `tinymceExtension` | `.wysiwyg` | Highlights `.mce-tinymce` instead of the textarea |

Customize match selectors with factories:

```js
import {
  createBootstrapSelectExtension,
  createTinymceExtension,
} from 'vanilla-js-validator/extensions';

new FormValidator(form)
  .use(createBootstrapSelectExtension({ matchClass: 'my-select' }))
  .use(createTinymceExtension({
    matchClass: 'rich-text',
    editorSelector: '.tox-tinymce',
  }))
  .setup();
```

See [`examples/extensions/01-using-built-ins.js`](./examples/extensions/01-using-built-ins.js).

### How to write your own extension

An extension is a plain object. Each hook is optional. Call **`next()`** when the field is not yours so other fields keep the default behavior.

**Hook signatures:**

| Hook | Signature |
|------|-----------|
| `highlightField` | `(field, options, next, ctx)` |
| `unhighlightField` | `(field, options, next, ctx)` |
| `showErrorMessage` | `(field, message, options, next, ctx)` |
| `removeErrorMessage` | `(field, options, next, ctx)` |

**Typical pattern:**

1. If the field doesn’t match your widget → `return next()`
2. Find the visible DOM node (wrapper, button, editor chrome)
3. Apply `options.errorClass` / insert the message with the shared helpers

```js
import {
  FormValidator,
  addClasses,
  removeClasses,
  insertErrorAfter,
} from 'vanilla-js-validator';

const amountInputExtension = {
  name: 'amountInput',

  highlightField(field, options, next) {
    if (!field.classList.contains('amount-input')) return next();
    const group = field.closest('.input-group');
    if (group) addClasses(group, options.errorClass);
  },

  unhighlightField(field, options, next) {
    if (!field.classList.contains('amount-input')) return next();
    const group = field.closest('.input-group');
    if (group) removeClasses(group, options.errorClass);
  },

  showErrorMessage(field, message, options, next) {
    if (!field.classList.contains('amount-input')) return next();
    const group = field.closest('.input-group');
    if (!group) return next();
    insertErrorAfter(group, message, options);
  },
};

new FormValidator(form).use(amountInputExtension).setup();
```

Helpers available for extension authors:

| Helper | Purpose |
|--------|---------|
| `addClasses(el, classNames)` | Add space-separated classes (Tailwind-safe) |
| `removeClasses(el, classNames)` | Remove space-separated classes |
| `insertErrorAfter(el, message, options)` | Create + insert the error node after `el` |
| `createErrorElement(host, message, options)` | Build the error node without inserting |
| `getFieldContainer(field, options)` | Resolve the configured field container |
| `defaultHooks` | Default implementations (useful in function extensions) |

More complete samples:

- [`02-custom-input-group.js`](./examples/extensions/02-custom-input-group.js) — input group with prefix
- [`03-custom-select-widget.js`](./examples/extensions/03-custom-select-widget.js) — factory for a custom select
- [`04-function-extension.js`](./examples/extensions/04-function-extension.js) — function style (legacy-style overrides)

## API

### `new FormValidator(form, options?)`

Creates a validator for an `HTMLFormElement`.  
`options.extensions` may be an array of extension objects or functions.

### `use(extension)`

Registers one extension, an array of extensions, or a function `(validator) => void`. Returns `this`.

### `setup()`

Enables validation listeners and sets `novalidate`. Idempotent. Returns `this`.

### `teardown(options?)`

Unbinds the validator from the form:

- removes blur / submit listeners
- removes `novalidate` (native HTML validation works again)
- clears error highlights / messages and custom validity (unless `{ clearErrors: false }`)

```js
// Stimulus / component lifecycle
connect() {
  this.validator = new FormValidator(this.element).setup();
}

disconnect() {
  this.validator?.teardown();
}
```

### `clearErrors()`

Removes error UI and custom validity from all fields **without** unbinding listeners. Returns `this`.

### `isBound`

`true` while listeners from `setup()` are active.

### `validateForm()`

Validates all eligible fields. Returns `boolean`.

### `validateField(field)`

Validates one field and refreshes its error UI. Returns `boolean`.

### `shouldValidateField(field)`

Returns whether the field is enabled and matches `fieldSelector`.

### `formFields`

Array of fields matched by `fieldSelector`.

### `firstInvalidField`

First field with `validity.valid === false` (after validation).

### `loadWidgetExtensions(validator, options?)`

Registers the built-in Bootstrap Select + TinyMCE extensions (optional flags: `bootstrapSelect`, `tinymce`).

## Project layout

```
src/
  FormValidator.js    # public class
  options.js          # defaults + option merging
  validators.js       # Constraint Validation wrappers
  presets/            # default / bootstrap / tailwind class maps
  extensions/         # widget adapters (selectpicker, tinymce, ...)
  dom/                # class helpers + error UI
styles/
  default.css         # optional styles for the default preset
stories/              # Storybook HTML demos (native fields only)
examples/
  extensions/         # extension code samples (no Storybook deps)
test/                 # node:test + jsdom
```

## Development

```bash
# Preferred: Node 24 Active LTS (see .nvmrc). Node 20+ also works for tests.
nvm use

npm install
npm test
npm run test:coverage
npm run storybook
```

### Versioning

This package follows [semver](https://semver.org/).

| Version | Meaning |
|---------|---------|
| `0.1.0` | Initial public API (current) — may still refine details before 1.0 |
| `0.x` | Breaking changes allowed between minors while the API settles |
| `1.0.0` | Stable public API |

Bump with normal npm versioning when you publish, e.g. `npm version patch|minor|major`.

## License

MIT
