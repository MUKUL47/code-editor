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
  activeRowIndex = getSpanIndex(activeSpanElement);
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
  const row = getLineRow();
  if (wasSpaceLast(activeLastSpan)) {
    //new text after space
    const s = createNewSpan(event.key);
    activeSpanSubstringIdx = 1;
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
  const activeLastSpan = activeSpanElement;
  const hasSpace = activeLastSpan.innerHTML.includes("&nbsp;");
  //already has space
  const ceilIndex = activeSpanSubstringIdx * 6;
  if (hasSpace && ceilIndex > -1) {
    //calculate substring space chunk first assign it to innerHTML
    // &nbsp[&NBPS]...
    activeLastSpan.innerHTML =
      activeLastSpan.innerHTML.substr(0, ceilIndex) +
      "&nbsp" +
      activeLastSpan.innerHTML.substr(ceilIndex);
    activeSpanSubstringIdx += 6; // "&nbsp|"
    return activeLastSpan;
  }
  const isCursorEnd =
    activeLastSpan.innerHTML.length === activeSpanSubstringIdx;
  //check if adding space at the end of the line
  // if (isCursorEnd && !hasSpace) {
  //   //check if next span is a space -> then append that span instead
  //   const idx = Number(activeLastSpan.getAttribute("index"));
  //   if (idx > -1) {
  //     const children = getSpanChildren();
  //     if (children[idx + 1]?.innerHTML.includes("&nbsp")) {
  //       activeSpanSubstringIdx = 0;
  //       activeSpanElement = children[idx + 1];
  //       return addNonBreakingSpace(event);
  //     }
  //   }
  // }
  // //add space btw 2 characters
  // //split by substringIdx assign individual span for each char and append a nbsp
  // else if (!isCursorEnd) {
  //   const firstHalf = createNewSpan(
  //     activeLastSpan.innerHTML.substr(0, activeSpanSubstringIdx)
  //   );
  //   const secondHalf = createNewSpan(
  //     activeLastSpan.innerHTML.substr(activeSpanSubstringIdx)
  //   );
  //   const newSpace = createNewSpan("&nbsp");
  //   const index = getSpanIndex(activeLastSpan);
  //   const row = getLineRow();
  //   activeLastSpan.remove();
  //   if (index === 0) {
  //     row.innerHTML =
  //       firstHalf.outerHTML +
  //       newSpace.outerHTML +
  //       secondHalf.outerHTML +
  //       [...row.children].map((v) => v.outerHTML).join("");
  //   } else {
  //     const previousSpan = row.children[index - 1];
  //     previousSpan.insertAdjacentElement("afterend", secondHalf);
  //     previousSpan.insertAdjacentElement("afterend", newSpace);
  //     previousSpan.insertAdjacentElement("afterend", firstHalf);
  //   }
  //   activeSpanElement = newSpace;
  //   activeSpanSubstringIdx = 1;
  //   return activeSpanElement;
  // }
  //next span doesnt exist this is for brand new space
  const s = createNewSpan("&nbsp");
  activeSpanSubstringIdx = 6; // "&nbsp|"
  row.appendChild(s);
  return s;
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
