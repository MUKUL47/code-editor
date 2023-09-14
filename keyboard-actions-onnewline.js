function updateOrAddNewLine() {
  //
  let row = getRowById();
  const currentRowHTML = row.innerText;
  const { updatedRow, value } = handleInputWhileTextSelected(
    currentRowHTML,
    ""
  );
  if (updatedRow) constructRowSpans(updatedRow || row, value || "");
  //adding line in the end
  const slicedData = getSliceDataIFF();
  activeSpanSubstringIdx = 0;
  if (activeRowIndex === IDE.children.length - 1) {
    activeSpanSubstringIdx = 0;
    const row = addNewLine(++activeRowIndex);
    slicedData && constructRowSpans(row, slicedData);
    return getLastRowChild();
  }
  //adding in between
  for (let i = Number(activeRowIndex) + 1; i < IDE.children.length; i++) {
    IDE.children[i].style.top = `${(i + 1) * ROW_HEIGHT}px`;
  }
  getRowById().insertAdjacentElement("afterend", newRow(++activeRowIndex));
  addNewTextSpan();
  slicedData && constructRowSpans(getRowById(), slicedData);
  return getLastRowChild();
}

function getSliceDataIFF() {
  const row = getRowById();
  const currentRowHTML = row.innerText;
  if (!activeSpanSubstringIdx) {
    constructRowSpans(row, "");
    return currentRowHTML;
  }
  constructRowSpans(row, currentRowHTML.slice(0, activeSpanSubstringIdx));
  return currentRowHTML.slice(activeSpanSubstringIdx);
}
