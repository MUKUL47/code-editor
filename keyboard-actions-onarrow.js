function onArrowMovement(event) {
  event.preventDefault();
  const direction = event.key.toLowerCase();
  let row = getRowById();
  let current = row.innerText.length;
  const isNextRowAvailable = IDE.children[activeRowIndex + 1];
  if (direction === "arrowup") {
    if (activeRowIndex === 0) return;
    const previous = getRowById(activeRowIndex - 1).innerText.length;
    activeRowIndex--;
    activeSpanSubstringIdx = Math.min(previous, activeSpanSubstringIdx);
    return;
  } else if (direction === "arrowdown") {
    if (!isNextRowAvailable) return;
    const next = getLastRowChild(activeRowIndex + 1).innerText.length;
    activeSpanSubstringIdx = Math.min(next, activeSpanSubstringIdx);
    activeRowIndex++;
  } else if (direction === "arrowright") {
    if (!isNextRowAvailable && current.length === activeSpanSubstringIdx) {
      return;
    }
    if (isNextRowAvailable && current === activeSpanSubstringIdx) {
      activeRowIndex += 1;
      activeSpanSubstringIdx = 0;
      return;
    }
    activeSpanSubstringIdx =
      activeSpanSubstringIdx < current
        ? activeSpanSubstringIdx + 1
        : activeSpanSubstringIdx;
  } else {
    const prevRow = IDE.children[activeRowIndex - 1];
    if (!prevRow && activeSpanSubstringIdx === 0) {
      return;
    }
    if (prevRow && activeSpanSubstringIdx === 0) {
      activeRowIndex -= 1;
      activeSpanSubstringIdx = prevRow.innerText.length;
      return;
    }
    activeSpanSubstringIdx =
      activeSpanSubstringIdx > 0
        ? activeSpanSubstringIdx - 1
        : activeSpanSubstringIdx;
  }
  return;
}
