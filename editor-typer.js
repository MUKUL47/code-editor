function updateActiveRowIdx(e) {
  activeRowIndex =
    e.srcElement.parentElement.hasAttribute("row-index") ||
    e.target.hasAttribute("row-index")
      ? e.srcElement.parentElement.getAttribute("row-index") ||
        e.target.getAttribute("row-index")
      : finalRowIndex;
}
function onBackspace(event) {
  const row = getLineRow();
  const lastSpan = getLastRowChild();
  const len = lastSpan.innerHTML.length;
  const spanChildren = getSpanChildren();
  if (
    //row is empty move to previous row
    // 2 -> extra span for cursor
    spanChildren.length === 1 &&
    !!!lastSpan.innerHTML.length &&
    activeRowIndex > 0
  ) {
    activeRowIndex--;
    updateTypeSpanCommands.backspaceAndClear();
    return getLastRowChild();
  }
  const sliceIdx = wasSpaceLast(lastSpan) ? 6 : 1;
  lastSpan.innerHTML = lastSpan.innerHTML.slice(0, len - sliceIdx);
  if (!!!lastSpan.innerHTML.length && spanChildren.length > 1) {
    //row is still not empty after clearing
    updateTypeSpanCommands.backspace();
    lastSpan.remove();
    return getLastRowChild();
  }
  //still has space
  return lastSpan;
}
function addText(event) {
  const row = getLineRow();
  const lastSpan = getLastRowChild();
  if (wasSpaceLast(lastSpan)) {
    //new text after space
    updateTypeSpanCommands.newSpan();
    const s = E("span", {
      attributes: {
        index: getSpanChildren().length,
        content: !!1,
      },
    });
    s.innerHTML = event.key;
    row.appendChild(s);
    return row;
  }
  //continue typing
  lastSpan.innerHTML += event.key;
}
function addNonBreakingSpace(event) {
  const row = getLineRow();
  const lastSpan = getLastRowChild();
  if (lastSpan.innerHTML.includes("&nbsp;")) {
    lastSpan.innerHTML += "&nbsp;";
  } else {
    const s = E("span", {
      attributes: {
        content: !!1,
        index: getSpanChildren().length,
      },
    });
    s.innerHTML = "&nbsp";
    row.appendChild(s);
    updateTypeSpanCommands.newSpan();
    return s;
  }
}

//PENDINGdassad
function checkIfLastSpanOverflow() {
  const span = getLastRowChild();
  const spanDomRect = span.getBoundingClientRect();
  if (IDE_DOMRECT.right < spanDomRect.right) {
    if (!wasSpaceLast(span)) {
      const content = span.innerHTML;
      span.remove();
      updateOrAddNewLine();
      const newSpan = getLastRowChild();
      newSpan.innerHTML = content;
    }
  }
}
