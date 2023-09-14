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
      [constants.ROW_INDEX]: Math.random(),
    },
    class: constants.CLASS_NEW_LINE,
  });
}

/**
 * spans of row index
 * @param {number} index index
 * @returns {HTMLCollection}
 */
function getSpanChildren(index) {
  const row = getRowById(index);
  return row.querySelectorAll("span");
}

/**
 * spans of row by id
 * @param {number} index
 * @returns {HTMLElement[]}
 */
function getRowById(index) {
  return IDE.children[index == undefined ? activeRowIndex : index] ?? null;
}

/**
 * appends a row
 * @param {number} pointer height yAxis
 * @returns HTMLElement
 */
function addNewLine(pointer) {
  const e = newRow(pointer != undefined ? pointer : ++newLineCounter);
  // rowLineMap.set(newLineCounter, e);
  IDE.appendChild(e);
  addNewTextSpan();
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
  console.log(arguments);
  TEXT_SELECTION.innerHTML = "";
}

/**
 * find row index
 * @param {HTMLElement} row
 * @returns {number}
 */
function getRowIndex(row) {
  for (let i = 0; i < IDE.children.length; i++) {
    if (IDE.children[i] === row) return i;
  }
  return -1;
}

/**
 *
 * @param {number} index
 * @returns {HTMLElement}
 */
function getRowByIndex(index) {
  for (let i = 0; i < IDE.children.length; i++) {
    if (IDE.children[i].getAttribute(constants.ROW_INDEX) == index)
      return [IDE.children[i], i];
  }
  return [null, -1];
}
