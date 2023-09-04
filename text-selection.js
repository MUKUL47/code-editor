//selection using mouse

let ideMouseDownX = -1;
let ideMouseDownY = -1;
let ideMouseUpX = -1;
let ideMouseUpY = -1;
let mouseUp = true;

document.addEventListener("mousedown", (e) => {
  removePreviousSelection();
  reconstructRow(getLineRow());
  ideMouseDownX = e.clientX;
  ideMouseDownY = e.clientY;
  mouseUp = false;
});
document.addEventListener("mousemove", (e) => {
  if (!!mouseUp) return;
  removePreviousSelection();
  reconstructRow(getLineRow());
  onMouseSelection(e);
});
document.addEventListener("mouseup", (e) => {
  mouseUp = true;
});

function onMouseSelection(e) {
  ideMouseUpX = e.clientX;
  ideMouseUpY = e.clientY;
  if (
    (ideMouseDownX === ideMouseUpX && ideMouseDownY === ideMouseUpY) ||
    [ideMouseDownX, ideMouseDownY, ideMouseUpY, ideMouseUpY].includes(-1) ||
    mouseUp
  ) {
    return;
  }
  console.log(ideMouseDownY);
  //slice the text in 3 parts calculate spans for all three and append
  //text-selection class to 2nd one rebuild the row
  //WIP calculate selected text from different span this only works for single span at the moment
  const sourceRowIdx = Math.floor(ideMouseDownY / ROW_HEIGHT);
  const targetRowIdx = Math.floor(ideMouseUpY / ROW_HEIGHT);
  const startE = document.caretRangeFromPoint(
    ideMouseDownX,
    Math.ceil(ideMouseDownY / ROW_HEIGHT) * ROW_HEIGHT
  );
  const endE = document.caretRangeFromPoint(
    ideMouseUpX,
    Math.ceil(ideMouseUpY / ROW_HEIGHT) * ROW_HEIGHT
  );
  const startParentE = startE.commonAncestorContainer.parentElement;
  const endParentE = endE.commonAncestorContainer.parentElement;
  if (sourceRowIdx != targetRowIdx) {
    if (sourceRowIdx < targetRowIdx) {
      //down
      const firstRow = getLineRow(sourceRowIdx);
      const firstRowOffet =
        Number(startParentE.getAttribute("prevLength")) + startE.startOffset;
      const s1 = createNewSpan(
        firstRow.innerText.slice(firstRowOffet).replaceAll(" ", "&nbsp;")
      );
      s1.className = "text-selection";
      appendSpansToRow(firstRow, [
        ...getTextSplits(firstRow.innerText.slice(0, firstRowOffet)).map((s) =>
          createNewSpan(s)
        ),
        s1,
      ]);
      //   for (let i = sourceRowIdx + 1; i < targetRowIdx; i++) {
      //     const r = getLineRow(i);
      //     const s = createNewSpan(r.innerText.replaceAll(" ", "&nbsp;"));
      //     s.className = "text-selection";
      //     r.innerHTML = s.innerHTML;
      //   }
      //////////////////////
      const secondRow = getLineRow(targetRowIdx);
      const lastRowOffset =
        Number(endParentE.getAttribute("prevLength")) + endE.startOffset;
      const s2 = createNewSpan(
        secondRow.innerText.slice(0, lastRowOffset).replaceAll(" ", "&nbsp;")
      );
      s2.className = "text-selection";
      appendSpansToRow(secondRow, [
        s2,
        ...getTextSplits(secondRow.innerText.slice(lastRowOffset)).map((s) =>
          createNewSpan(s)
        ),
      ]);
      ////////////////////////
    } else {
      //up
    }
    return;
  }
  const start =
    Number(startParentE.getAttribute("prevLength")) + startE.startOffset;
  const end = Number(endParentE.getAttribute("prevLength")) + endE.startOffset;
  const [i, j] = start > end ? [end, start] : [start, end];
  if (i != j) applySelection(getLineRow(), i, j);
}

function applySelection(row, i, j) {
  const rowText = row.innerText;
  const [firstHalfSpan, selectionTextSpan, secondHalfSpan] = [
    getTextSplits(rowText.slice(0, i)),
    rowText.slice(i, j),
    getTextSplits(rowText.slice(j)),
  ];
  const span = createNewSpan(selectionTextSpan.replaceAll(" ", "&nbsp;"));
  span.className = "text-selection";
  console.log(selectionTextSpan.replaceAll(" ", "&nbsp;"));
  appendSpansToRow(row, [
    ...firstHalfSpan.map((s) => createNewSpan(s)),
    span,
    ...secondHalfSpan.map((s) => createNewSpan(s)),
  ]);
}
