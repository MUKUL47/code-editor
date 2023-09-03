//selection using mouse

let ideMouseDownX = -1;
let ideMouseDownY = -1;
let ideMouseUpX = -1;
let ideMouseUpY = -1;
let mouseUp = true;

document.addEventListener("mousedown", (e) => {
  removePreviousSelection("mouseup");
  reconstructRow(getLineRow());
  ideMouseDownX = e.clientX;
  ideMouseDownY = e.clientY;
  mouseUp = false;
});
document.addEventListener("mousemove", (e) => {
  if (!!mouseUp) return;
  removePreviousSelection("mouseup");
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

  //slice the text in 3 parts calculate spans for all three and append
  //text-selection class to 2nd one rebuild the row
  //WIP calculate selected text from different span this only works for single span at the moment
  const start = document.caretRangeFromPoint(
    ideMouseDownX,
    ideMouseDownY
  ).startOffset;
  const end = document.caretRangeFromPoint(
    ideMouseUpX,
    ideMouseUpY
  ).startOffset;
  console.log(start, end, ideMouseDownX, ideMouseUpX);
  const [i, j] = start > end ? [end, start] : [start, end];
  if (i === j) return;
  const row = getLineRow();
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
