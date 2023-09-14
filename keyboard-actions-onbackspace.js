/**
 *
 * @param {Event} e
 * @returns {void}
 */
function onBackspace(e) {
  const row = getRowById();
  const currentRowHTML = row.innerText;
  const { updatedRow, value } = handleInputWhileTextSelected(
    currentRowHTML,
    ""
  );
  if (updatedRow) return constructRowSpans(updatedRow || row, value || "");
  if (activeSpanSubstringIdx === 0) {
    if (activeRowIndex === 0) return;
    // delete this row update remaining below and concat current row text with previous one
    // reorderRowsIndexOnDelete();
    activeRowIndex--;
    const previousRow = getRowById();
    activeSpanSubstringIdx = previousRow.innerText.length;
    constructRowSpans(previousRow, previousRow.innerText + currentRowHTML);
    row.remove();
    return;
  }
  let sliceIndex = 1;
  let newRowText = "";
  if (e.ctrlKey) {
    const [activeSpan, _, activeSpanSlicedIdx] = getSpanWithSubstrIndex(
      getSpanChildren()
    );
    activeSpan.innerText = activeSpan.innerText.slice(activeSpanSlicedIdx);
    sliceIndex = activeSpanSlicedIdx;
    newRowText = row.innerText;
  } else {
    newRowText = `${currentRowHTML.slice(
      0,
      activeSpanSubstringIdx - sliceIndex
    )}${currentRowHTML.slice(activeSpanSubstringIdx)}`;
  }
  constructRowSpans(row, newRowText);
  activeSpanSubstringIdx -= sliceIndex;
  return;
}
