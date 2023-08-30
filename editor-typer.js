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

function onSpace() {
  const row = getLineRow();
  const currentRowHTML = row.innerText;
  const newRowText = `${currentRowHTML.slice(
    0,
    activeSpanSubstringIdx
  )}${" "}${currentRowHTML.slice(activeSpanSubstringIdx)}`;
  constructRowSpans(row, newRowText);
  activeSpanSubstringIdx++;
}

function onBackspace() {
  const row = getLineRow();
  const currentRowHTML = row.innerText;
  if (activeSpanSubstringIdx === 0) return;
  const newRowText = `${currentRowHTML.slice(
    0,
    activeSpanSubstringIdx - 1
  )}${currentRowHTML.slice(activeSpanSubstringIdx)}`;
  constructRowSpans(row, newRowText);
  activeSpanSubstringIdx--;
}

function updateOrAddNewLine() {
  activeSpanSubstringIdx = 0;
  //adding line in the end
  if (activeRowIndex === IDE.children.length - 1) {
    addNewLine();
    return getLastRowChild();
  }
  //adding in between
  for (let i = Number(activeRowIndex) + 1; i < IDE.children.length; i++) {
    IDE.children[i].style.top = `${(i + 1) * 15}px`;
    IDE.children[i].setAttribute("row-index", i + 1);
  }
  getLineRow().insertAdjacentElement("afterend", newRow(++activeRowIndex));
  addNewTextSpan();
  return getLastRowChild();
}

function updateNewLineWithSliceData() {}
