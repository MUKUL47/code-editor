/**
 *
 * @param {KeyboardEvent} event
 * @returns {{ disableSelectionReset: boolean }} - if shift key is active and selection is in progress
 */
function onArrowMovement(event) {
  event.preventDefault();
  updateLastShiftKey(event);
  handleArrowMovement(event);
  /**
   * @todo BUG source target arent in sync
   */
  if (wasShiftKey(event)) {
    updateTextCursorOnEvent();
    TEXT_CURSOR.style.zIndex = -11;
    const currentBounds = TEXT_CURSOR.getBoundingClientRect();
    const endE = getCarentPosition(currentBounds.x, currentBounds.y);
    TEXT_CURSOR.style.zIndex = 0;
    if (!endE || !originalShiftKeyboardSpanE) return;
    initializeSelection({
      endE,
      startE: originalShiftKeyboardSpanE,
      sourceRowIdx: originalShiftKeyboardRowIdx,
      targetRowIdx: activeRowIndex,
    });
    return { disableSelectionReset: true };
  }
  return { disableSelectionReset: false };
}

/**
 *
 * @param {KeyboardEvent} event
 * @returns {void}
 */
function updateLastShiftKey(event) {
  if (event.shiftKey && !!!originalShiftKeyboardSpanE) {
    originalShiftKeyboardRowIdx = activeRowIndex;
    TEXT_CURSOR.style.zIndex = -11;
    const bounds = TEXT_CURSOR.getBoundingClientRect();
    originalShiftKeyboardSpanE = getCarentPosition(bounds.x, bounds.y);
    TEXT_CURSOR.style.zIndex = 0;
  }
}

function wasShiftKey(e) {
  if (
    e.shiftKey &&
    originalShiftKeyboardRowIdx > -1 &&
    !!originalShiftKeyboardSpanE
  ) {
    return true;
  }
  removePreviousTextSelection();
  originalShiftKeyboardRowIdx = null;
  originalShiftKeyboardSpanE = null;
  return false;
}

function handleArrowMovement(event) {
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
}
