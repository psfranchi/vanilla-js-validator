# Extension examples (docs only)

These are **code samples** for widget adapters (Bootstrap Select, TinyMCE, custom overrides).

They are intentionally **not** Storybook stories — that would pull heavy optional dependencies into the demo app.

| File | What it shows |
|------|----------------|
| [`01-using-built-ins.js`](./01-using-built-ins.js) | Register Bootstrap Select + TinyMCE extensions |
| [`02-custom-input-group.js`](./02-custom-input-group.js) | Full custom extension for a prefix/suffix input group |
| [`03-custom-select-widget.js`](./03-custom-select-widget.js) | Factory-style extension for a custom select UI |
| [`04-function-extension.js`](./04-function-extension.js) | Function extension (same idea as the old overrides helper) |

For interactive HTML field demos (text, radio, checkbox, etc.), run Storybook:

```bash
npm run storybook
```

Imports in these files use relative paths so they work from this repo. In an app, import from `vanilla-js-validator` instead:

```js
import { FormValidator, insertErrorAfter } from 'vanilla-js-validator';
```
