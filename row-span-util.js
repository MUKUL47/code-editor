function getTextWidth(rowIndex, span, offset) {
  const row = getLineRow(rowIndex);
  if (!row) return 0;
  const text = row.innerText.slice(0, getSubstringSliceIndex(span, offset));
  const s = createNewSpan(text);
  s.style.position = "absolute";
  IDE.append(s);
  let right = s.getBoundingClientRect().width;
  s.remove();
  return right;
}
function getSubstringSliceIndex(span, offset) {
  return +span.getAttribute("prevLength") + offset;
}
function getSpanIndex(span) {
  return +span.getAttribute("i");
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
