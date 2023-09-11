function updateActiveRowIdx(e) {
  const parentE = e.srcElement.parentElement;
  const target = e.target;
  activeRowIndex = getRowIndex(
    parentE.classList.contains(constants.CLASS_NEW_LINE) ? parentE : target
  );
  activeRowIndex = activeRowIndex === -1 ? 0 : activeRowIndex;
}

function onSpaceTab(e) {
  e.preventDefault();
  const isTab = e.key === "Tab";
  const row = getRowById();
  const currentRowHTML = row.innerText;
  const newRowText = `${currentRowHTML.slice(0, activeSpanSubstringIdx)}${
    isTab ? "   " : " "
  }${currentRowHTML.slice(activeSpanSubstringIdx)}`;
  constructRowSpans(row, newRowText);
  activeSpanSubstringIdx += isTab ? 3 : 1;
}

function onBackspace(e) {
  const row = getRowById();
  const currentRowHTML = row.innerText;
  if (activeSpanSubstringIdx === 0) {
    if (activeRowIndex === 0) return;
    // delete this row update remaining below and concat current row text with previous one
    // reorderRowsIndexOnDelete();
    activeRowIndex--;
    const previousRow = getRowById();
    activeSpanSubstringIdx = previousRow.innerText.length;
    constructRowSpans(previousRow, previousRow.innerText + currentRowHTML);
    removeRows([row]);
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

function updateOrAddNewLine() {
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

function onArrowMovement(event) {
  event.preventDefault();
  const direction = event.key.toLowerCase();
  let row = getRowById();
  let current = row.innerText.length;
  const isNextRowAvailable = IDE.children[activeRowIndex + 1];
  if (direction === "arrowup") {
    if (activeRowIndex === 0) return;
    const previous = getRowById(activeRowIndex - 1).innerText.length;
    activeRowIndex--;
    activeSpanSubstringIdx = Math.min(previous, activeSpanSubstringIdx);
    return;
  } else if (direction === "arrowdown") {
    if (!isNextRowAvailable) return;
    const next = getLastRowChild(activeRowIndex + 1).innerText.length;
    activeSpanSubstringIdx = Math.min(next, activeSpanSubstringIdx);
    activeRowIndex++;
  } else if (direction === "arrowright") {
    if (!isNextRowAvailable && current.length === activeSpanSubstringIdx) {
      return;
    }
    if (isNextRowAvailable && current === activeSpanSubstringIdx) {
      activeRowIndex += 1;
      activeSpanSubstringIdx = 0;
      return;
    }
    activeSpanSubstringIdx =
      activeSpanSubstringIdx < current
        ? activeSpanSubstringIdx + 1
        : activeSpanSubstringIdx;
  } else {
    const prevRow = IDE.children[activeRowIndex - 1];
    if (!prevRow && activeSpanSubstringIdx === 0) {
      return;
    }
    if (prevRow && activeSpanSubstringIdx === 0) {
      activeRowIndex -= 1;
      activeSpanSubstringIdx = prevRow.innerText.length;
      return;
    }
    activeSpanSubstringIdx =
      activeSpanSubstringIdx > 0
        ? activeSpanSubstringIdx - 1
        : activeSpanSubstringIdx;
  }
  return;
}

//select control+click+drag
//from the click and hold find the source
//on each drag clear background select color and recalculate
