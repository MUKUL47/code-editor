function updateActiveRowIdx(e) {
  const parentE = e.srcElement.parentElement;
  const target = e.target;
  activeSpanElement = parentE.hasAttribute("content")
    ? parentE
    : target.hasAttribute("content")
    ? target
    : target === IDE
    ? IDE.children[IDE.children.length - 1].children[
        IDE.children[IDE.children.length - 1].children.length - 1
      ]
    : target.children[target.children.length - 1];
  activeRowIndex = parentE.hasAttribute("row-index")
    ? Number(parentE.getAttribute("row-index"))
    : Number(target.getAttribute("row-index"));
}
function onBackspace(event) {
  const activeLastSpan = activeSpanElement || getLastRowChild();
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
  const activeLastSpan = activeSpanElement;
  if (wasSpaceLast(activeSpanElement)) {
    //new text after space
    const s = createNewSpan(event.key);
    activeSpanSubstringIdx = 1;
    activeSpanElement.insertAdjacentElement("afterend", s);
    return s;
  }
  //continue typing
  const text = activeSpanElement.innerHTML;
  activeSpanElement.innerHTML = `${text.substr(0, activeSpanSubstringIdx)}${
    event.key
  }${text.substr(activeSpanSubstringIdx)}`;
  activeSpanSubstringIdx++;
  return activeSpanElement;
}

//PENDINGdassad
// function checkIfLastSpanOverflow() {
//   const span = activeSpanElement || getLastRowChild();
//   const spanDomRect = span.getBoundingClientRect();
//   if (IDE_DOMRECT.right < spanDomRect.right) {
//     if (!wasSpaceLast(span)) {
//       const content = span.innerHTML;
//       span.remove();
//       updateOrAddNewLine();
//       const newSpan = activeSpanElement || getLastRowChild();
//       newSpan.innerHTML = content;
//     }
//   }
// }
