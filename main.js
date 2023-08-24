function span() {
  return document.createElement("span");
}
function newRow(n) {
  const r = document.createElement("div");
  r.style.top = `${n * 15}px`;
  r.setAttribute("row-index", n);
  r.className = "newline";
  return r;
}
function textCursor() {
  const s = span();
  s.className = "text-pipe";
  s.id = "text-pipe";
  s.textContent = "|";
  s.style.position = "absolute";
  return s;
}
function addNewLine() {
  IDE.appendChild(newRow(++activeRowIndex));
  finalRowIndex = activeRowIndex;
  addNewTextSpan();
}
function addNewTextSpan() {
  const s = span();
  s.setAttribute("content", !!1);
  s.setAttribute("index", 0);
  getLineRow()?.appendChild(s);
}
function getLineRow() {
  return document.querySelector(`div[row-index="${activeRowIndex}"]`);
}
addNewLine();
updateTextCursor();
IDE.addEventListener("click", (e) => {
  activeRowIndex =
    e.srcElement.parentElement.hasAttribute("row-index") ||
    e.target.hasAttribute("row-index")
      ? e.srcElement.parentElement.getAttribute("row-index") ||
        e.target.getAttribute("row-index")
      : finalRowIndex;
  updateTextCursor();
});
function getActiveRow() {
  return document.querySelector(`div[row-index="${activeRowIndex}"]`);
}
function getLastRowChild() {
  const row = getActiveRow();
  return row.children[row.children.length - 1];
}
function updateOrAddNewLine() {
  if (activeRowIndex === finalRowIndex) {
    addNewLine();
  } else {
    activeRowIndex++;
  }
}
window.addEventListener("keydown", (event) => {
  const code = event.code.toLowerCase(); //Alt Space
  if (code === "enter") {
    updateOrAddNewLine();
    updateTextCursor();
    return;
  }
  const keyCode = event.keyCode || event.which;
  const isValidKey = keyCode >= 32 && keyCode <= 126;
  //get latest span and append the key;
  const row = document.querySelector(`div[row-index="${activeRowIndex}"]`); //IDE.children[activeRowIndex];
  const lastSpan = getLastRowChild();
  if (["space", "tab"].includes(code)) {
    //check if last span contains space or tab use that else append new
    addNonBreakingSpace({ lastSpan, row });
  } else if (isValidKey) {
    addText({ lastSpan, row, event });
  } else if (code === "backspace") {
    onBackspace({ lastSpan, row });
  }
  updateTextCursor();
});
function addNonBreakingSpace({ lastSpan, row }) {
  if (lastSpan.innerHTML.includes("&nbsp;")) {
    lastSpan.innerHTML += "&nbsp;";
  } else {
    const s = span();
    s.setAttribute("content", !!1);
    s.innerHTML = "&nbsp";
    s.setAttribute("index", getActiveRow().children.length);
    row.appendChild(s);
    return s;
  }
}

function onBackspace({ lastSpan, row }) {
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
function wasSpaceLast(span) {
  return span.innerHTML.slice(span.innerHTML.length - 6) === "&nbsp;";
}
function addText({ lastSpan, row, event }) {
  if (wasSpaceLast(lastSpan)) {
    const s = span();
    s.innerHTML = event.key;
    s.setAttribute("index", getActiveRow().children.length);
    s.setAttribute("content", !!1);
    row.appendChild(s);
    return row;
  }
  lastSpan.innerHTML += event.key;
  // checkIfLastSpanOverflow();
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
function updateTextCursor(customCoords) {
  const { left } = customCoords || {};
  const spanTextElement = getLastRowChild();
  TEXT_CURSOR.style.top = `${activeRowIndex * 15}px`;
  TEXT_CURSOR.style.left = customCoords
    ? left + "px"
    : spanTextElement.offsetLeft + spanTextElement.offsetWidth + "px";
}
