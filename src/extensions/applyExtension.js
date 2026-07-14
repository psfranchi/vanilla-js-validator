import { defaultHooks } from '../dom/errors.js';

const HOOK_NAMES = Object.keys(defaultHooks);

/**
 * Wrap a single hook so the extension can call `next()` for previous behavior.
 * @param {string} name
 * @param {Function} previous
 * @param {Function} method
 */
function wrapHook(name, previous, method) {
  if (name === 'showErrorMessage') {
    return (field, message, options, ctx) => {
      const next = () => previous(field, message, options, ctx);
      return method(field, message, options, next, ctx);
    };
  }

  return (field, options, ctx) => {
    const next = () => previous(field, options, ctx);
    return method(field, options, next, ctx);
  };
}

/**
 * Apply an object-style extension onto a validator instance.
 * Each provided hook wraps the current hook and receives `next`.
 *
 * @param {import('../FormValidator.js').FormValidator} validator
 * @param {object} extension
 */
export function applyExtension(validator, extension) {
  if (!extension || typeof extension !== 'object') {
    throw new TypeError('Extension must be an object or a function');
  }

  for (const name of HOOK_NAMES) {
    if (typeof extension[name] !== 'function') continue;

    const previous = validator.options[name] || defaultHooks[name];
    validator.options[name] = wrapHook(name, previous, extension[name]);
  }

  validator.extensions.push(extension);
}
