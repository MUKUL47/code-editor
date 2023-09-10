/**
 * calculate row substring using prevLength + current element offset value;
 * create new span with new substring and append in IDE;
 * post DOM addition calculate boundingRect.width, remove element
 * @param {number} rowIndex
 * @param {HTMLElement} span
 * @param {number} offset active span substring index
 * @returns {number} right most coordinate of the active caret
 */
function getTextWidth(rowIndex, span, offset) {
  const row = getRowById(rowIndex);
  if (!row) return [0, 0];
  const sliceIdx = getSubstringSliceIndex(span, offset);
  const text = row.innerText.slice(0, sliceIdx);
  const s = createNewSpan(text);
  s.style.position = "absolute";
  IDE.append(s);
  const right = s.getBoundingClientRect().width;
  s.remove();
  return [right, sliceIdx];
}
/**
 * prevLength attribute in span + custom offset
 * @param {HTMLElement} span
 * @param {number} offset
 * @returns {number}
 */
function getSubstringSliceIndex(span, offset) {
  return +span.getAttribute("prevLength") + offset;
}
/**
 *
 * @param {HTMLElement} span
 * @returns {number}
 */
function getSpanIndex(span) {
  return +span.getAttribute("i");
}

/**
 * @todo this is one HEAVY fn optimize or find an alternative******************
 * @param {HTMLElement} currentRow
 * @returns {Array} [lastOffsetElement, length, remainingLength]
 */
function getSpanWithSubstrIndex(currentRow) {
  const len = currentRow.length;
  let s = "";
  for (let i = 0; i < currentRow.length; i++) {
    const remaining = activeSpanSubstringIdx - s.length;
    const inner = currentRow[i].innerText;
    s += inner;
    if (s.length >= activeSpanSubstringIdx)
      return [currentRow[i], i, remaining];
  }
  return [currentRow[len - 1], len - 1, s.length - activeSpanSubstringIdx];
}
/**
 *
 * @returns {HTMLCollection}
 */
function getTextSelections() {
  return TEXT_SELECTION.children;
}

/**
 * reoder rows
 * @param {number} rowIndex
 * @param {number} margin how many rows
 */
function reorderRowsIndexOnDelete(rowIndex = activeRowIndex, margin = 1) {
  for (let i = Number(rowIndex + margin); i < IDE.children.length; i++) {
    IDE.children[i].style.top = `${(i - margin) * ROW_HEIGHT}px`;
  }
}
