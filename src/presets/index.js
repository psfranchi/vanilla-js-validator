import { defaultPreset } from './default.js';
import { bootstrapPreset } from './bootstrap.js';
import { tailwindPreset } from './tailwind.js';

export { defaultPreset, bootstrapPreset, tailwindPreset };

export const presets = {
  default: defaultPreset,
  bootstrap: bootstrapPreset,
  tailwind: tailwindPreset,
};

/**
 * Resolve a preset name or object into a plain options fragment.
 * @param {string|object|undefined} preset
 * @returns {object}
 */
export function resolvePreset(preset) {
  if (preset == null || preset === 'default') {
    return { ...defaultPreset };
  }

  if (typeof preset === 'string') {
    const named = presets[preset];
    if (!named) {
      throw new Error(
        `Unknown preset "${preset}". Available: ${Object.keys(presets).join(', ')}`,
      );
    }
    return { ...named };
  }

  if (typeof preset === 'object') {
    return { ...preset };
  }

  throw new TypeError('preset must be a string name or an options object');
}