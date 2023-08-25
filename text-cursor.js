function addTextCursor(e) {
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
    const spanIdx = textSpanEle.getAttribute("index");
    const currentRow = getSpanChildren();
    const lengthUptoLast = currentRow[spanIdx > 0 ? spanIdx - 1 : 0];
    //
    TextCursorState.spanTextElement = textSpanEle;
    TextCursorState.spanCharIdx = range.startOffset;
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
  TEXT_CURSOR.style.top = `${activeRowIndex * 15}px`;
  TEXT_CURSOR.style.left = customCoords
    ? left + "px"
    : spanTextElement.getBoundingClientRect().right + "px";
}
