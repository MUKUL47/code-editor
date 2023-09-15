/**
 *
 * @param {string} elementType
 * @param {Object} options attriburtes, style, data.innerHTML, id, className
 * @returns Element
 */
function E(elementType, options = {}) {
  const element = document.createElement(elementType);

  if (options.attributes) {
    for (const attr in options.attributes) {
      element.setAttribute(attr, options.attributes[attr]);
    }
  }

  if (options.style) {
    for (const styleProp in options.style) {
      element.style[styleProp] = options.style[styleProp];
    }
  }

  if (options.data) {
    for (const dataKey in options.data) {
      element.dataset[dataKey] = options.data[dataKey];
    }
  }

  element.id = options.id || "";
  element.className = options.class || "";

  return element;
}
/**
 *
 * @param {string} data
 * @returns Element
 */
function createNewSpan(data) {
  const e = E("span", {
    attributes: {
      content: !!1,
    },
  });
  e.innerHTML = data ?? "";
  return e;
}
/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {Range}
 */
function getCarentPosition(x, y) {
  return (
    document.caretRangeFromPoint?.(x, y) || document.getCarentPosition?.(x, y)
  );
}

/**
 * concat list of strings
 * @param {string[]} strs
 * @returns
 */
function concat(...strs) {
  return strs.filter(String).join("");
}

/**
 *
 * @param  {...Number} n
 * @returns {`${Number}px`}
 */
function px(...n) {
  return n
    .reduce((a, c) => (isNaN(+a) ? 0 : +a) + c, 0)
    .toString()
    .concat("px");
}
