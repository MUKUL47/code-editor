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
  if (
    row.children.length === 1 &&
    !!!lastSpan.innerHTML.length &&
    activeRowIndex > 0
  ) {
    activeRowIndex--;
    return getLastRowChild();
  }
  const sliceIdx = wasSpaceLast(lastSpan) ? 6 : 1;
  lastSpan.innerHTML = lastSpan.innerHTML.slice(0, len - sliceIdx);
  if (!!!lastSpan.innerHTML.length && row.children.length > 1) {
    lastSpan.remove();
    return getLastRowChild();
  }
  return lastSpan;
}
function addText(event) {
  const row = getLineRow();
  const lastSpan = getLastRowChild();
  if (wasSpaceLast(lastSpan)) {
    const s = E("span", {
      attributes: {
        index: getLineRow().children.length,
        content: !!1,
      },
    });
    s.innerHTML = event.key;
    row.appendChild(s);
    return row;
  }
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
        index: getLineRow().children.length,
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
