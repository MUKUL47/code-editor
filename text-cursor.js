function addTextCursor(e) {
  try {
    activeRowIndex =
      e.clientY <= ROW_HEIGHT ? 0 : Math.floor(e.clientY / ROW_HEIGHT); //* ROW_HEIGHT;
    if (!e.srcElement.hasAttribute("content")) {
      return updateCursorOutsideVicinity(e);
    }
    const caretRange = getCarentPosition(e.clientX, e.clientY);
    if (!caretRange) return;
    const spanE = caretRange.startContainer.parentElement;
    activeSpanSubstringIdx = getSubstringSliceIndex(
      spanE,
      caretRange.startOffset
    );
    updateTextCursor({
      left: getTextWidth(activeRowIndex, spanE, caretRange.startOffset)[0],
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
    left: getTextWidth(activeRowIndex, e, e.innerText.length)[0],
  });
}
function updateTextCursor(customCoords) {
  const { left, top } = customCoords || {};
  TEXT_CURSOR.style.top = px(
    (top != undefined ? top : activeRowIndex) * ROW_HEIGHT
  );
  TEXT_CURSOR.style.left =
    left != undefined
      ? px(left)
      : px(getLastRowChild().getBoundingClientRect().right);
}

function updateTextCursorOnEvent() {
  TEXT_CURSOR.style.top = px(activeRowIndex * ROW_HEIGHT);
  const s = E("span", {
    style: {
      opacity: 0,
      position: "absolute",
      left: px(0),
    },
  });
  const children = getSpanChildren();
  const [spanElement, activeSpanIndex, remaining] =
    getSpanWithSubstrIndex(children);
  s.innerHTML = spanElement?.innerText.substr(0, remaining) || "";
  IDE.append(s);
  const existingLen =
    activeSpanIndex > 0
      ? children[activeSpanIndex - 1].getBoundingClientRect().right
      : 0;
  TEXT_CURSOR.style.left = px(s.getBoundingClientRect().width, existingLen);
  s.remove();
}
