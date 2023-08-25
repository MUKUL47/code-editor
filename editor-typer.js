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
  const activeLastSpan = getLastRowChild();
  const len = activeLastSpan.innerHTML.length;
  const spanChildren = getSpanChildren();
  if (
    //row is empty move to previous row
    spanChildren.length === 1 &&
    !!!activeLastSpan.innerHTML.length &&
    activeRowIndex > 0
  ) {
    getLineRow(activeRowIndex).remove();
    for (let i = Number(activeRowIndex); i < IDE.children.length; i++) {
      // update y coordinate of rest of span
      IDE.children[i].style.top = `${i * 15}px`;
      IDE.children[i].setAttribute("row-index", i);
    }
    activeRowIndex--;
    return activeLastSpan;
  }
  const sliceIdx = wasSpaceLast(activeLastSpan) ? 6 : 1;
  activeLastSpan.innerHTML = activeLastSpan.innerHTML.slice(0, len - sliceIdx);
  if (!!!activeLastSpan.innerHTML.length && spanChildren.length > 1) {
    //row is still not empty after clearing
    activeLastSpan.remove();
    return activeLastSpan;
  }
  //still has space
  return activeLastSpan;
}
function addText(event) {
  const activeLastSpan = getLastRowChild();
  const row = getLineRow();
  if (wasSpaceLast(activeLastSpan)) {
    //new text after space
    const s = E("span", {
      attributes: {
        index: getSpanChildren().length,
        content: !!1,
      },
    });
    s.innerHTML = event.key;
    row.appendChild(s);
    return s;
  }
  //continue typing
  const text = activeSpanElement.innerHTML;
  activeSpanElement.innerHTML = `${text.substr(0, activeSpanSubstringIdx)}${
    event.key
  }${text.substr(activeSpanSubstringIdx)}`;
  activeSpanSubstringIdx++;
  return activeLastSpan;
}
function addNonBreakingSpace(event) {
  const row = getLineRow();
  const activeLastSpan = getLastRowChild();
  if (activeLastSpan.innerHTML.includes("&nbsp;")) {
    activeLastSpan.innerHTML += "&nbsp;";
    return activeLastSpan;
  }
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
