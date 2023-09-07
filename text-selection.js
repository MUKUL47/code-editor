//selection using mouse

let ideMouseDownX = -1;
let ideMouseDownY = -1;
let ideMouseUpX = -1;
let ideMouseUpY = -1;
let mouseUp = true;

document.addEventListener("mousedown", (e) => {
  removePreviousSelection();
  ideMouseDownX = e.clientX;
  ideMouseDownY = e.clientY;
  mouseUp = false;
});
document.addEventListener("mousemove", (e) => {
  if (!!mouseUp) return;
  removePreviousSelection();
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
  const sourceRowIdx = Math.floor(ideMouseDownY / ROW_HEIGHT);
  const targetRowIdx = Math.floor(ideMouseUpY / ROW_HEIGHT);
  if (!IDE.children[sourceRowIdx]) return;
  const startE = document.caretRangeFromPoint(
    ideMouseDownX,
    Math.ceil(ideMouseDownY / ROW_HEIGHT) * ROW_HEIGHT
  );
  const endE = document.caretRangeFromPoint(
    ideMouseUpX,
    Math.ceil(ideMouseUpY / ROW_HEIGHT) * ROW_HEIGHT
  );
  if (sourceRowIdx != targetRowIdx) {
    if (sourceRowIdx < targetRowIdx) {
      //down
      createSelection(
        sourceRowIdx,
        startE,
        getLastRowChild(sourceRowIdx).getBoundingClientRect().right
      );
      for (let i = sourceRowIdx + 1; i < targetRowIdx; i++) {
        createSelection(i, 0, getLastRowChild(i).getBoundingClientRect().right);
      }
      createSelection(targetRowIdx, 0, endE);
    } else {
      //up
      createSelection(sourceRowIdx, 0, startE);
      for (let i = sourceRowIdx - 1; i > targetRowIdx; i--) {
        createSelection(i, 0, getLastRowChild(i).getBoundingClientRect().right);
      }
      createSelection(
        targetRowIdx,
        endE,
        getLastRowChild(targetRowIdx).getBoundingClientRect().right
      );
    }
  } else {
    createSelection(sourceRowIdx, startE, endE);
  }
  //optimize cursor on event fn before proceeding
  activeRowIndex = targetRowIdx;
  activeSpanSubstringIdx =
    endE.startOffset +
    +endE.commonAncestorContainer.parentElement.getAttribute("prevLength");
  //   updateTextCursorOnEvent();
}

function createSelection(yAxis, startEle, endEle) {
  const startPosition = calculateELastPosition(startEle);
  const endPosition = calculateELastPosition(endEle);
  const s = createNewSpan();
  s.style.position = "absolute";
  s.className = "text-selection";
  s.style.left = `${Math.min(endPosition, startPosition)}px`;
  s.style.width = `${
    startPosition > endPosition
      ? startPosition - endPosition
      : endPosition - startPosition
  }px`;
  s.style.height = `${ROW_HEIGHT}px`;
  s.style.top = `${yAxis * ROW_HEIGHT}px`;
  TEXT_SELECTION.appendChild(s);
}
function calculateELastPosition(e) {
  if (typeof e === "number") return e;
  const element = e.commonAncestorContainer.parentElement;
  const eSliceIdx = e.startOffset;
  const newSpan = createNewSpan(element.innerText.slice(0, eSliceIdx));
  element.insertAdjacentElement("beforebegin", newSpan);
  const position = element.getBoundingClientRect().left;
  newSpan.remove();
  return position;
}
