//selection using mouse

let ideMouseDownX = -1;
let ideMouseDownY = -1;
let ideMouseUpX = -1;
let ideMouseUpY = -1;
let mouseUp = true;
let lastYAxisMovement = -1;
let mouseDownTime = 0;
let mouseUpTime = 0;
IDE.addEventListener("mousedown", (e) => {
  mouseDownTime = Date.now();
  ideMouseDownX = e.clientX;
  ideMouseDownY = e.clientY;
  mouseUp = false;
});
IDE.addEventListener("mousemove", (e) => {
  if (!!mouseUp) return;
  addTextCursor(e);
  onMouseSelection(e);
});
IDE.addEventListener("mouseup", (e) => {
  addTextCursor(e);
  updateActiveRowIdx(e);
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
  let selectionSpans = [];
  if (sourceRowIdx != targetRowIdx) {
    if (sourceRowIdx < targetRowIdx) {
      //down
      selectionSpans.push(
        createSelection(
          sourceRowIdx,
          startE,
          getLastRowChild(sourceRowIdx).getBoundingClientRect().right
        )
      );
      for (let i = sourceRowIdx + 1; i < targetRowIdx; i++) {
        selectionSpans.push(
          createSelection(
            i,
            0,
            getLastRowChild(i).getBoundingClientRect().right
          )
        );
      }
      selectionSpans.push(createSelection(targetRowIdx, 0, endE));
    } else {
      //up
      selectionSpans.push(createSelection(sourceRowIdx, 0, startE));
      for (let i = sourceRowIdx - 1; i > targetRowIdx; i--) {
        selectionSpans.push(
          createSelection(
            i,
            0,
            getLastRowChild(i).getBoundingClientRect().right
          )
        );
      }
      selectionSpans.push(
        createSelection(
          targetRowIdx,
          endE,
          getLastRowChild(targetRowIdx).getBoundingClientRect().right
        )
      );
    }
  } else {
    let s = createSelection(sourceRowIdx, startE, endE, true);
    s && selectionSpans.push(s);
    if (s) {
      TEXT_SELECTION.innerHTML = "";
    }
  }
  const len = selectionSpans.length;
  selectionSpans = selectionSpans.filter(Boolean);
  if (
    sourceRowIdx != targetRowIdx &&
    len !== selectionSpans.length &&
    targetRowIdx === lastYAxisMovement
  ) {
    selectionSpans = [];
  } else if (sourceRowIdx != targetRowIdx) {
    TEXT_SELECTION.innerHTML = "";
  }
  lastYAxisMovement = targetRowIdx;
  TEXT_SELECTION.append(...selectionSpans);
}

function createSelection(yAxis, startEle, endEle) {
  const startPosition = calculateELastPosition(yAxis, startEle);
  const endPosition = calculateELastPosition(yAxis, endEle);
  if (!endPosition) return null;
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
  return s;
}
function calculateELastPosition(rowId, e) {
  if (typeof e === "number") return e;
  return getTextWidth(
    rowId,
    e.commonAncestorContainer.parentElement,
    e.startOffset
  );
}
