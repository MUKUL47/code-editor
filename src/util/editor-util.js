import { constants } from "../state";
import { E, createNewSpan, px } from "../util";
/**
 * new row
 * @param {number} n
 * @returns HTMLElement
 */
export function newRow(n) {
  return E("div", {
    style: {
      top: px(n * ROW_HEIGHT),
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
export function getSpanChildren(index) {
  const row = getRowById(index);
  return row.querySelectorAll("span");
}

/**
 * spans of row by id
 * @param {number} index
 * @returns {HTMLElement[]}
 */
export function getRowById(index) {
  return IDE.children[index == undefined ? activeRowIndex : index] ?? null;
}

/**
 * appends a row
 * @param {number} pointer height yAxis
 * @returns HTMLElement
 */
export function addNewLine(pointer) {
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
export function addNewTextSpan(data) {
  const e = createNewSpan(data);
  getRowById()?.appendChild(e);
  return e;
}

/**
 * last span of row
 * @param {number} index
 * @returns HTMLElement
 */
export function getLastRowChild(index) {
  const row = getRowById(index);
  const nodes = row.querySelectorAll("span");
  return nodes?.[nodes.length - 1];
}

/**
 * @param {string} text
 * @returns Array
 */
export function getTextSplits(text) {
  return text.split(/(\s+|\.|\(|\))/).filter(String);
}

/**
 * construct row spans by spliting text and appending new spans
 * @param {HTMLElement} row
 * @param {string} newRowText
 * @returns HTMLElement
 */
export function constructRowSpans(row, newRowText) {
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
export function removePreviousTextSelection() {
  TEXT_SELECTION.innerHTML = "";
}

/**
 * find row index
 * @param {HTMLElement} row
 * @returns {number}
 */
export function getRowIndex(row) {
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
export function getRowByIndex(index) {
  for (let i = 0; i < IDE.children.length; i++) {
    if (IDE.children[i].getAttribute(constants.ROW_INDEX) == index)
      return [IDE.children[i], i];
  }
  return [null, -1];
}

/**
 *
 * @returns {number}
 */
export function editorLeft() {
  return IDE.getBoundingClientRect().left;
}

/**
 *
 * @param {string} e
 * @returns {void}
 */
export function initializeEditorDom(e, state) {
  const lineNumberDiv = E("div", { id: "line-number" });
  const textPipeDiv = E("div", { class: "text-pipe", id: "TEXT_CURSOR" });
  const ideDiv = E("div", { id: "ide" });
  const textSelectionDiv = E("div", { id: "TEXT_SELECTION" });
  const innerDiv = E("div");
  innerDiv.appendChild(textPipeDiv);
  innerDiv.appendChild(ideDiv);
  const containerDiv = E("div");
  containerDiv.appendChild(lineNumberDiv);
  containerDiv.appendChild(innerDiv);
  const editorDom = document.getElementById(e);
  editorDom._state = state;
  editorDom.appendChild(containerDiv);
  editorDom.appendChild(textSelectionDiv);
}

export function getState() {
  //TODO
  return document.querySelector("code_editor[active='true']")._state;
}
