function updateActiveRowIdx(e) {
  const parentE = e.srcElement.parentElement;
  const target = e.target;

  const newRowId = parentE.hasAttribute("row-index")
    ? Number(parentE.getAttribute("row-index"))
    : Number(target.getAttribute("row-index"));
  activeRowIndex = newRowId;
  if (parentE.hasAttribute("row-index") || target.hasAttribute("row-index")) {
    activeSpanSubstringIdx = getLineRow().innerText.length;
  }
}

function onKeystroke(e) {
  //e.key
  const row = getLineRow();
  const currentRowHTML = row.innerText;
  const newRowText = `${currentRowHTML.slice(0, activeSpanSubstringIdx)}${
    e.key
  }${currentRowHTML.slice(activeSpanSubstringIdx)}`;
  constructRowSpans(row, newRowText);
  activeSpanSubstringIdx++;
}

function onSpaceTab(e) {
  e.preventDefault();
  const isTab = e.key === "Tab";
  const row = getLineRow();
  const currentRowHTML = row.innerText;
  const newRowText = `${currentRowHTML.slice(0, activeSpanSubstringIdx)}${
    isTab ? "   " : " "
  }${currentRowHTML.slice(activeSpanSubstringIdx)}`;
  constructRowSpans(row, newRowText);
  activeSpanSubstringIdx += isTab ? 3 : 1;
}

function onBackspace(e) {
  const row = getLineRow();
  const currentRowHTML = row.innerText;
  if (activeSpanSubstringIdx === 0) {
    if (activeRowIndex === 0) return;
    // delete this row update remaining below and concat current row text with previous one
    for (let i = Number(activeRowIndex + 1); i < IDE.children.length; i++) {
      IDE.children[i].style.top = `${(i - 1) * 15}px`;
      IDE.children[i].setAttribute("row-index", i - 1);
    }
    activeRowIndex--;
    const previousRow = getLineRow();
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
    newRowText = row.innerText;
    activeSpanSubstringIdx -= activeSpanSlicedIdx;
  } else {
    newRowText = `${currentRowHTML.slice(
      0,
      activeSpanSubstringIdx - sliceIndex
    )}${currentRowHTML.slice(activeSpanSubstringIdx)}`;
    activeSpanSubstringIdx -= sliceIndex;
  }
  constructRowSpans(row, newRowText);
  return;
}

function updateOrAddNewLine() {
  //adding line in the end
  const slicedData = getSliceDataIFF();
  activeSpanSubstringIdx = 0;
  if (activeRowIndex === IDE.children.length - 1) {
    activeSpanSubstringIdx = 0;
    const row = addNewLine();
    slicedData && constructRowSpans(row, slicedData);
    return getLastRowChild();
  }
  //adding in between
  for (let i = Number(activeRowIndex) + 1; i < IDE.children.length; i++) {
    IDE.children[i].style.top = `${(i + 1) * 15}px`;
    IDE.children[i].setAttribute("row-index", i + 1);
  }
  getLineRow().insertAdjacentElement("afterend", newRow(++activeRowIndex));
  addNewTextSpan();
  slicedData && constructRowSpans(getLineRow(), slicedData);
  return getLastRowChild();
}

function getSliceDataIFF() {
  const row = getLineRow();
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
  let row = getLineRow();
  let current = row.innerText.length;
  const isNextRowAvailable = IDE.children[activeRowIndex + 1];
  if (direction === "arrowup") {
    if (activeRowIndex === 0) return;
    const previous = getLineRow(activeRowIndex - 1).innerText.length;
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
