/**
 * Apply space-separated class names (supports multi-class Tailwind strings).
 * @param {Element} element
 * @param {string} classNames
 */
export function addClasses(element, classNames) {
  const list = splitClasses(classNames);
  if (list.length) element.classList.add(...list);
}

/**
 * @param {Element} element
 * @param {string} classNames
 */
export function removeClasses(element, classNames) {
  const list = splitClasses(classNames);
  if (list.length) element.classList.remove(...list);
}

/**
 * @param {string} classNames
 * @returns {string[]}
 */
export function splitClasses(classNames) {
  if (!classNames) return [];
  return String(classNames).split(/\s+/).filter(Boolean);
}
