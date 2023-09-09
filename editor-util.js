/**
 * new row
 * @param {number} n
 * @returns HTMLElement
 */
function newRow(n) {
  return E("div", {
    style: {
      top: `${n * ROW_HEIGHT}px`,
    },
    attributes: {
      "row-index": n,
    },
    class: "newline",
  });
}

/**
 * spans of row index
 * @param {number} index index
 * @returns HTMLElement[]
 */
function getSpanChildren(index) {
  const row = getRowById(index);
  return row.querySelectorAll("span");
}

/**
 * spans of row by id
 * @param {number} index
 * @returns HTMLElement[]
 */
function getRowById(index) {
  return IDE.children[index == undefined ? activeRowIndex : index] ?? null;
}

/**
 * appends a row
 * @returns HTMLElement
 */
function addNewLine() {
  const e = newRow(++activeRowIndex);
  IDE.appendChild(e);
  activeSpanElement = addNewTextSpan();
  return e;
}

/**
 * add a new span to an active row
 * @param {string|number} data
 * @returns HTMLElement
 */
function addNewTextSpan(data) {
  const e = createNewSpan(data);
  getRowById()?.appendChild(e);
  return e;
}

/**
 * last span of row
 * @param {number} index
 * @returns HTMLElement
 */
function getLastRowChild(index) {
  const row = getRowById(index);
  const nodes = row.querySelectorAll("span");
  return nodes?.[nodes.length - 1];
}

/**
 * @param {string} text
 * @returns Array
 */
function getTextSplits(text) {
  return text.split(/(\s+|\.|\(|\))/).filter(String);
}

/**
 * construct row spans by spliting text and appending new spans
 * @param {HTMLElement} row
 * @param {string} newRowText
 * @returns HTMLElement
 */
function constructRowSpans(row, newRowText) {
  //DO NOT USE REGEX TRAVERSAL STRING NORMALLY
  const spans = getTextSplits(newRowText);
  row.innerHTML = "";
  let previousDataCount = 0;
  for (let i = 0; i < spans.length; i++) {
    const split = spans[i];
    const data = split.includes(" ")
      ? Array(split.length).fill("&nbsp;").join("")
      : split;
    const e = createNewSpan(data);
    e.setAttribute("i", i);
    e.setAttribute("len", split.length);
    e.setAttribute("prevLength", previousDataCount);
    previousDataCount += split.length;
    row.append(e);
  }
  if (row.children.length === 0) {
    row.append(createNewSpan(""));
  }
}

/**
 * removes active text-selection
 */
function removePreviousTextSelection() {
  TEXT_SELECTION.innerHTML = "";
}
