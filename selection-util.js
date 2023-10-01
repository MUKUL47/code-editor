//WIP improved text cursor util but oops doesnt work xD
//remove user-select none
/**
 *
 * @returns {boolean}
 */
function isSelection() {
  const selection = window.getSelection();
  return (
    selection.focusNode != selection.anchorNode ||
    (selection.focusNode === selection.anchorNode &&
      selection.focusOffset != selection.anchorOffset)
  );
}

/**
 *
 * @returns {boolean}
 */
function isClick() {
  return !isSelection();
}

/**
 *@returns {number}
 */
function getClickCoordinates() {
  if (isSelection()) return -1;
  const selection = window.getSelection();
  const textData = selection.focusNode.nodeValue || "";
  const e = selection.focusNode.parentElement;
  e.innerHTML = concat(
    textData.slice(0, selection.focusOffset),
    createNewSpan(
      textData.slice(selection.focusOffset, selection.focusOffset + 1)
    ).outerHTML,
    textData.slice(selection.focusOffset + 1)
  );
  let coordinate = e.children[0].getBoundingClientRect().left;
  e.innerHTML = e.innerText;
  return coordinate;
}
