document.addEventListener("click", (e) => {
  return;
  let range;
  let textNode;
  let offset;
  if (!e.srcElement.hasAttribute("content")) return;
  range = document.caretRangeFromPoint(e.clientX, e.clientY);
  textNode = range.startContainer;
  offset = range.startOffset;
  if (!textNode) return;
  const firstHalf = textNode.data.slice(0, range.startOffset);
  const textSpanEle = e.srcElement;
  const spanIdx = textSpanEle.getAttribute("index");
  const currentRow = getLineRow();
  const lengthUptoLast = currentRow.children[spanIdx > 0 ? spanIdx - 1 : 0];
  const s = span();
  s.innerHTML = firstHalf;
  if (spanIdx == 0) {
    getLineRow().append(s);
    finalLeftCoord =
      s.getBoundingClientRect().right - s.getBoundingClientRect().left;
  } else {
    lengthUptoLast.insertAdjacentElement("afterend", s);
    finalLeftCoord = s.offsetLeft + s.offsetWidth;
  }
  s.remove();
  updateTextCursor({ left: finalLeftCoord });
});
function updateTextCursor() {
  getLineRow().appendChild(generateTextCursor());
}
