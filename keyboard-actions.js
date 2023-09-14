function updateActiveRowIdx(e) {
  const parentE = e.srcElement.parentElement;
  const target = e.target;
  activeRowIndex = getRowIndex(
    parentE.classList.contains(constants.CLASS_NEW_LINE) ? parentE : target
  );
  activeRowIndex = activeRowIndex === -1 ? 0 : activeRowIndex;
}

//select control+click+drag
//from the click and hold find the source
//on each drag clear background select color and recalculate
