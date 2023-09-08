function addTextCursor(e) {
  try {
    activeRowIndex = e.clientY <= 15 ? 0 : Math.floor(e.clientY / ROW_HEIGHT); //* ROW_HEIGHT;
    if (!e.srcElement.hasAttribute("content")) {
      return updateCursorOutsideVicinity(e);
    }
    const caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (!caretRange) return;
    activeSpanSubstringIdx = getSubstringSliceIndex(
      caretRange.startContainer.parentElement,
      caretRange.startOffset
    );
    activeSpanElement = caretRange.startContainer.parentElement;
    updateTextCursor({
      left: getTextWidth(
        activeRowIndex,
        activeSpanElement,
        caretRange.startOffset
      ),
    });
  } catch (e) {
    console.log(e);
  }
}
function updateCursorOutsideVicinity(event) {
  const isLeftBounds = IDE.offsetLeft >= event.clientX;
  const e = getLastRowChild(activeRowIndex);
  activeSpanSubstringIdx = isLeftBounds
    ? 0
    : getSubstringSliceIndex(e, e.innerText.length);
  updateTextCursor({
    left: isLeftBounds
      ? 0
      : getTextWidth(activeRowIndex, e, e.innerText.length),
  });
}
function updateTextCursor(customCoords) {
  const { left, top } = customCoords || {};
  TEXT_CURSOR.style.top = `${
    (top != undefined ? top : activeRowIndex) * ROW_HEIGHT
  }px`;
  TEXT_CURSOR.style.left =
    left != undefined
      ? left + "px"
      : getLastRowChild().getBoundingClientRect().right + "px";
}

function updateTextCursorOnEvent() {
  TEXT_CURSOR.style.top = `${activeRowIndex * ROW_HEIGHT}px`;
  const s = E("span", {
    style: {
      opacity: 0,
      position: "absolute",
      left: "0px",
    },
  });
  const children = getSpanChildren();
  const [spanElement, activeSpanIndex, remaining] =
    getSpanWithSubstrIndex(children);
  s.innerHTML = spanElement.innerText.substr(0, remaining);
  IDE.append(s);
  const existingLen =
    activeSpanIndex > 0
      ? children[activeSpanIndex - 1].getBoundingClientRect().right
      : 0;
  TEXT_CURSOR.style.left = `${s.getBoundingClientRect().width + existingLen}px`;
  s.remove();
}
function getSpanWithSubstrIndex(currentRow) {
  const len = currentRow.length;
  let s = "";
  for (let i = 0; i < currentRow.length; i++) {
    const remaining = activeSpanSubstringIdx - s.length;
    const inner = currentRow[i].innerText;
    s += inner;
    if (s.length >= activeSpanSubstringIdx)
      return [currentRow[i], i, remaining];
  }
  return [currentRow[len - 1], len - 1, s.length - activeSpanSubstringIdx];
}
