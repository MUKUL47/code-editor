function addNonBreakingSpace(event) {
  const activeLastSpan = activeSpanElement;
  const hasSpace = activeLastSpan.innerHTML.includes("&nbsp;");
  //already has space
  const ceilIndex = activeSpanSubstringIdx * 6;
  if (hasSpace && ceilIndex > -1) {
    return addNonBreakingSpace_appendspacebtw(activeLastSpan, ceilIndex);
  }
  const isCursorEnd =
    activeLastSpan.innerHTML.length === activeSpanSubstringIdx;
  // //check if adding space at the end of the line
  if (isCursorEnd && !hasSpace) {
    //check if next span is a space -> then append that span instead
    const isSpaceAfterWord = addNonBreakingSpace_addspaceafterwordend(event);
    if (isSpaceAfterWord) return isSpaceAfterWord;
  }
  // //add space btw 2 characters
  // //split by substringIdx assign individual span for each char and append a nbsp
  else if (!isCursorEnd) {
    return addNonBreakingSpace_addspacebtwchars(activeLastSpan, ceilIndex);
  }
  //next span doesnt exist this is for brand new space
  const s = createNewSpan("&nbsp");
  activeSpanSubstringIdx = 6; // "&nbsp|"
  activeLastSpan.insertAdjacentElement("afterend", s);
  return s;
}
function addNonBreakingSpace_appendspacebtw(activeLastSpan, ceilIndex) {
  //calculate substring space chunk first assign it to innerHTML
  // &nbsp[&NBPS]...
  activeLastSpan.innerHTML =
    activeLastSpan.innerHTML.substr(0, ceilIndex) +
    "&nbsp" +
    activeLastSpan.innerHTML.substr(ceilIndex);
  activeSpanSubstringIdx += 6; // "&nbsp|"
  return activeLastSpan;
}
function addNonBreakingSpace_addspacebtwchars(activeLastSpan) {
  const firstHalf = createNewSpan(
    activeLastSpan.innerHTML.substr(0, activeSpanSubstringIdx)
  );
  const secondHalf = createNewSpan(
    activeLastSpan.innerHTML.substr(activeSpanSubstringIdx)
  );
  const newSpace = createNewSpan("&nbsp");
  const index = getSpanIndex(activeLastSpan);
  const row = getLineRow();
  activeLastSpan.remove();
  if (index === 0) {
    row.innerHTML =
      firstHalf.outerHTML +
      secondHalf.outerHTML +
      [...row.children].map((v) => v.outerHTML).join("");
    row.children[0].insertAdjacentElement("afterend", newSpace);
  } else {
    const previousSpan = row.children[index - 1];
    previousSpan.insertAdjacentElement("afterend", secondHalf);
    previousSpan.insertAdjacentElement("afterend", newSpace);
    previousSpan.insertAdjacentElement("afterend", firstHalf);
  }
  activeSpanElement = newSpace;
  activeSpanSubstringIdx = 1;
  return activeSpanElement;
}
function addNonBreakingSpace_addspaceafterwordend(event) {
  const idx = getSpanIndex(activeSpanElement);
  if (idx > -1) {
    const children = getSpanChildren();
    if (children[idx + 1]?.innerHTML.includes("&nbsp")) {
      activeSpanSubstringIdx = 0;
      activeSpanElement = children[idx + 1];
      return addNonBreakingSpace(event);
    }
  }
  return false;
}
