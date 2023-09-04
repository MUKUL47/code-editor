function addTextCursor(e) {
  //on documnet
  try {
    let range;
    let textNode;
    let offset;
    if (!e.srcElement.hasAttribute("content")) return;
    range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (!range) return;
    textNode = range.startContainer;
    offset = range.startOffset;
    const firstHalf = textNode.data.slice(0, range.startOffset);
    const textSpanEle = e.srcElement;
    const spanIdx = getSpanIndex(textSpanEle);
    const currentRow = getSpanChildren();
    const lengthUptoLast = currentRow[spanIdx > 0 ? spanIdx - 1 : 0];
    //
    activeSpanSubstringIdx = calculateSubstringIndex(spanIdx, range); // range.startOffset;
    activeSpanElement = range.startContainer.parentNode;
    activeSpanIndex = getSpanIndex(activeSpanElement);
    //
    const s = E("span", {
      style: {
        opacity: 0,
        position: "absolute",
        left: "0px",
      },
    });
    s.innerHTML = firstHalf;
    let bounds;
    IDE.append(s);
    bounds = s.getBoundingClientRect();
    finalLeftCoord =
      spanIdx != 0
        ? lengthUptoLast.getBoundingClientRect().right + bounds.width
        : bounds.right;
    s.remove();
    updateTextCursor({ left: finalLeftCoord });
  } catch (e) {
    console.log("cursor-", e);
  }
}
function updateTextCursor(customCoords) {
  const { left } = customCoords || {};
  const spanTextElement = getLastRowChild();
  TEXT_CURSOR.style.top = `${activeRowIndex * ROW_HEIGHT}px`;
  TEXT_CURSOR.style.left = customCoords
    ? left + "px"
    : spanTextElement.getBoundingClientRect().right + "px";
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
function calculateSubstringIndex(index, range) {
  const currentRow = getSpanChildren();
  if (!index) return range.startOffset;
  let c = 0;
  for (let i = 0; i < index; i++) {
    c += currentRow[i].innerText.length;
  }
  return range.startOffset + c;
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
