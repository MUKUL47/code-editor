/**
 *
 * @param {Event} e
 */
function onKeystroke(e) {
  //e.key
  e.preventDefault();
  const isTab = e.key.toLowerCase() === constants.KEYSTROKES.TAB;
  let row = getRowById();
  const currentRowHTML = row.innerText;
  const k = isTab ? "   " : e.key;
  const { updatedRow, value } = handleInputWhileTextSelected(currentRowHTML, k);
  let newRowText =
    value ??
    concat(
      currentRowHTML.slice(0, activeSpanSubstringIdx),
      k,
      currentRowHTML.slice(activeSpanSubstringIdx)
    );
  activeSpanSubstringIdx += isTab
    ? constants.KEYSTROKES_COUNT.TAB
    : constants.KEYSTROKES_COUNT.DEFAULT;
  constructRowSpans(updatedRow || row, newRowText);
}
