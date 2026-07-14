import { addClasses, removeClasses } from '../dom/classes.js';

/**
 * Support for TinyMCE / markdown editor widgets.
 * Highlights the editor chrome (`.mce-tinymce`) instead of the hidden textarea.
 *
 * @param {object} [config]
 * @param {string} [config.matchClass='wysiwyg']
 * @param {string} [config.editorSelector='.mce-tinymce']
 * @returns {object}
 */
export function createTinymceExtension({
  matchClass = 'wysiwyg',
  editorSelector = '.mce-tinymce',
} = {}) {
  function matches(field) {
    return field.classList.contains(matchClass);
  }

  function editorRoot(field) {
    return field.parentElement?.querySelector(editorSelector) ?? null;
  }

  return {
    name: 'tinymce',

    highlightField(field, options, next) {
      if (!matches(field)) return next();

      const root = editorRoot(field);
      if (root) addClasses(root, options.errorClass);
    },

    unhighlightField(field, options, next) {
      if (!matches(field)) return next();

      const root = editorRoot(field);
      if (root) removeClasses(root, options.errorClass);
    },
  };
}

export const tinymceExtension = createTinymceExtension();
