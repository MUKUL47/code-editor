function addTextCursor(e) {
  try {
    activeRowIndex =
      e.clientY <= ROW_HEIGHT ? 0 : Math.floor(e.clientY / ROW_HEIGHT); //* ROW_HEIGHT;
    if (!e.srcElement.hasAttribute("content")) {
      return updateCursorOutsideVicinity(e);
    }
    const caretRange = getCarentPosition(e.clientX, e.clientY);
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
  if (IDE.offsetLeft >= event.clientX) {
    activeSpanSubstringIdx = 0;
    updateTextCursor({
      left: 0,
    });
    return;
  }
  const e = getLastRowChild(activeRowIndex);
  activeSpanSubstringIdx = getSubstringSliceIndex(e, e.innerText.length);
  updateTextCursor({
    left: getTextWidth(activeRowIndex, e, e.innerText.length),
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
