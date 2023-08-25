function updateActiveRowIdx(e) {
  const parentE = e.srcElement.parentElement;
  const target = e.target;
  activeRowIndex =
    parentE.getAttribute("row-index") ||
    target.getAttribute("row-index") ||
    activeRowIndex;
  activeRowIndex = Number(activeRowIndex);
  activeSpanElement = parentE.hasAttribute("content") ? parentE : target;
}
function onBackspace(event) {
  const lastSpan = getLastRowChild();
  const len = lastSpan.innerHTML.length;
  const spanChildren = getSpanChildren();
  if (
    //row is empty move to previous row
    spanChildren.length === 1 &&
    !!!lastSpan.innerHTML.length &&
    activeRowIndex > 0
  ) {
    getLineRow(activeRowIndex).remove();
    for (let i = Number(activeRowIndex); i < IDE.children.length; i++) {
      // update y coordinate of rest of span
      IDE.children[i].style.top = `${i * 15}px`;
      IDE.children[i].setAttribute("row-index", i);
    }
    activeRowIndex--;
    return getLastRowChild();
  }
  const sliceIdx = wasSpaceLast(lastSpan) ? 6 : 1;
  lastSpan.innerHTML = lastSpan.innerHTML.slice(0, len - sliceIdx);
  if (!!!lastSpan.innerHTML.length && spanChildren.length > 1) {
    //row is still not empty after clearing
    lastSpan.remove();
    return getLastRowChild();
  }
  //still has space
  return lastSpan;
}
function addText(event) {
  const lastSpan = getLastRowChild();
  // if (TextCursorState.spanTextElement && TextCursorState.spanCharIdx) {
  //   const text = TextCursorState.spanTextElement.innerHTML;
  //   lastSpan.innerHTML = `${text.substr(0, TextCursorState.spanCharIdx)}${
  //     event.key
  //   }${text.substr(TextCursorState.spanCharIdx)}`;
  //   TextCursorState.spanCharIdx++;
  //   return;
  // }
  const row = getLineRow();
  if (wasSpaceLast(lastSpan)) {
    //new text after space
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
