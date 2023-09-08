//selection using mouse

let ideMouseDownX = -1;
let ideMouseDownY = -1;
let ideMouseUpX = -1;
let ideMouseUpY = -1;
let mouseUp = true;

document.addEventListener("mousedown", (e) => {
  ideMouseDownX = e.clientX;
  ideMouseDownY = e.clientY;
  mouseUp = false;
});
document.addEventListener("mousemove", (e) => {
  if (!!mouseUp) return;
  onMouseSelection(e);
});
document.addEventListener("mouseup", (e) => {
  mouseUp = true;
  //   addTextCursor(e);
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
  removePreviousSelection();
  const sourceRowIdx = Math.floor(ideMouseDownY / ROW_HEIGHT);
  let targetRowIdx = Math.floor(ideMouseUpY / ROW_HEIGHT);
  targetRowIdx =
    targetRowIdx - 1 === IDE.children.length ? targetRowIdx - 1 : targetRowIdx;
  const startE = document.caretRangeFromPoint(
    ideMouseDownX,
    Math.ceil(ideMouseDownY / ROW_HEIGHT) * ROW_HEIGHT
  );
  const endE = document.caretRangeFromPoint(
    ideMouseUpX,
    Math.ceil(ideMouseUpY / ROW_HEIGHT) * ROW_HEIGHT
  );
  let position = {};
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
      position = createSelection(targetRowIdx, 0, endE);
    } else {
      //up
      position = createSelection(sourceRowIdx, 0, startE);
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
    position = createSelection(sourceRowIdx, startE, endE);
  }
}

function createSelection(yAxis, startEle, endEle) {
  const startPosition = calculateELastPosition(yAxis, startEle);
  const endPosition = calculateELastPosition(yAxis, endEle);
  if (!endPosition) return;
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
  return { endPosition, startPosition };
}
function calculateELastPosition(rowId, e) {
  if (typeof e === "number") return e;
  return getTextWidth(
    rowId,
    e.commonAncestorContainer.parentElement,
    e.startOffset
  );
}
