import { JSDOM } from 'jsdom';

/**
 * @param {string} bodyHtml
 */
export function createFormDom(bodyHtml) {
  const dom = new JSDOM(`<!DOCTYPE html><html><body>${bodyHtml}</body></html>`, {
    url: 'https://example.test/',
  });

  return {
    window: dom.window,
    document: dom.window.document,
    form: dom.window.document.querySelector('form'),
  };
}
