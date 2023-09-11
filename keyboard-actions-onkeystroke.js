function onKeystroke(e) {
  //e.key
  let row = getRowById();
  const currentRowHTML = row.innerText;
  let newRowText = "";
  //handle selection accordingly
  const selections = getTextSelections();
  if (selections.length > 0) {
    let removedCount = 0;
    const partialSelections = [];
    for (let selection of selections) {
      //iterate each selection and remove all covered up rows first;
      const endSlice = +selection.getAttribute(constants.END_SLICE_IDX);
      const rowIndex = selection.getAttribute(constants.ROW_INDEX);
      //if start and end coordinate is same as the width of the row
      //remove it reorder rows
      if (endSlice === +selection.style.width.replace("px", "")) {
        const [rowEle, rowOriginalIndex] = getRowByIndex(rowIndex);
        reorderRowsIndexOnDelete(rowOriginalIndex);
        rowEle.remove();
        removedCount++;
      } else {
        partialSelections.push(selection);
      }
    }
    //multi-line selection will always has 2 incomplete selections data
    //merge the rows accordingly
    if (partialSelections.length === 2) {
      //merge rows and concat the text;
      const [firstE, secondE] = partialSelections;
      const [firstERow] = getRowByIndex(
        firstE.getAttribute(constants.ROW_INDEX)
      );
      const [secondERow, secondERowIdx] = getRowByIndex(
        secondE.getAttribute(constants.ROW_INDEX)
      );
      //if selection is down -> text-cursor reference will be +1
      if (textSelectionDirection === constants.TEXT_SELECTION_DIR.down) {
        activeRowIndex -= 1;
      }
      const initialSliceIdx = +firstE.getAttribute(constants.START_SLICE_IDX);
      //[(UNSELECTED) HEY THERE][(SELECTED) HOW ARE YOU] ROW-1
      //[(SELECTED) I'AM FINE][(UNSELECTED) ?? ] ROW-2
      //FINAL - HEY THERE [NEW KEY] ??
      newRowText = concat(
        firstERow.innerText.slice(0, initialSliceIdx),
        e.key,
        secondERow.innerText.slice(
          +secondE.getAttribute(constants.END_SLICE_IDX)
        )
      );
      row = firstERow;
      activeSpanSubstringIdx = initialSliceIdx;
      reorderRowsIndexOnDelete(secondERowIdx);
      secondERow.remove();
    } else if (partialSelections.length === 1) {
      //xAxis selection
      //slice the data normally
      // [(UNSELECTED) HEY HOW] (START_SLICE_IDX) [(SELECTED)ARE] END_SLICE_IDX [(UNSELECTED) DOING] ??
      const singleSelection = partialSelections[0];
      const startSliceIdx = +singleSelection.getAttribute(
        constants.START_SLICE_IDX
      );
      const endSliceIdx = +singleSelection.getAttribute(
        constants.END_SLICE_IDX
      );
      newRowText = concat(
        currentRowHTML.slice(0, startSliceIdx),
        e.key,
        currentRowHTML.slice(endSliceIdx)
      );
      activeSpanSubstringIdx -= endSliceIdx - startSliceIdx;
    }
    //update activeRowIndex based on how many full selected rows were removed
    if (textSelectionDirection === constants.TEXT_SELECTION_DIR.down) {
      activeRowIndex -= removedCount;
    }
  } else {
    //normal keystroke event update
    newRowText = concat(
      currentRowHTML.slice(0, activeSpanSubstringIdx),
      e.key,
      currentRowHTML.slice(activeSpanSubstringIdx)
    );
  }
  activeSpanSubstringIdx++;
  constructRowSpans(row, newRowText);
}
