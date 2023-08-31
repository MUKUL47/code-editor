function updateActiveRowIdx(e) {
  const parentE = e.srcElement.parentElement;
  const target = e.target;
  const newRowId = parentE.hasAttribute("row-index")
    ? Number(parentE.getAttribute("row-index"))
    : Number(target.getAttribute("row-index"));
  activeRowIndex = newRowId;
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
  activeSpanSubstringIdx += isTab ? 2 : 1;
}

function onBackspace(e) {
  const row = getLineRow();
  const currentRowHTML = row.innerText;
  if (activeSpanSubstringIdx === 0) return;
  const newRowText = `${currentRowHTML.slice(
    0,
    activeSpanSubstringIdx - 1
  )}${currentRowHTML.slice(activeSpanSubstringIdx)}`;
  constructRowSpans(row, newRowText);
  activeSpanSubstringIdx--;
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
  const direction = event.key.toLowerCase().replace("arrow", "");
  let row = ["right", "left"].includes(direction)
    ? getLineRow().innerText
    : null;
  switch (direction) {
    case "up":
      activeRowIndex = !activeRowIndex ? activeRowIndex : activeRowIndex - 1;
      break;
    case "down":
      activeRowIndex =
        activeRowIndex >= IDE.children.length - 1
          ? activeRowIndex
          : activeRowIndex + 1;
      break;
    case "right":
      activeSpanSubstringIdx =
        activeSpanSubstringIdx >= row.length
          ? activeSpanSubstringIdx
          : activeSpanSubstringIdx + 1;
      break;
    case "left":
      activeSpanSubstringIdx =
        activeSpanSubstringIdx === 0
          ? activeSpanSubstringIdx
          : activeSpanSubstringIdx - 1;
      break;
  }
}
