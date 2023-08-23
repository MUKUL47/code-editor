let activeRowIndex = -1;
let finalRowIndex = -1;
const IDE = window["ide"];
const TEXT_CURSOR = window["TEXT_CURSOR"];
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
  getLineRow()?.appendChild(s);
}
function getLineRow() {
  return document.querySelector(`div[row-index="${activeRowIndex}"]`);
}
addNewLine();
updateTextCursor();
IDE.addEventListener("click", (e) => {
  activeRowIndex = e.target.getAttribute("row-index") ?? finalRowIndex;
  updateTextCursor();
});
function getActiveRow() {
  return document.querySelector(`div[row-index="${activeRowIndex}"]`);
}
function getLastRowOfLine() {
  const row = getActiveRow();
  return row.children[row.children.length - 1];
}
window.addEventListener("keydown", (event) => {
  const code = event.code.toLowerCase(); //Alt Space
  if (code === "enter") {
    if (activeRowIndex === finalRowIndex) {
      addNewLine();
    } else {
      activeRowIndex++;
    }
    updateTextCursor();
    return;
  }
  const keyCode = event.keyCode || event.which;
  const isValidKey = keyCode >= 32 && keyCode <= 126;
  //get latest span and append the key;
  const row = document.querySelector(`div[row-index="${activeRowIndex}"]`); //IDE.children[activeRowIndex];
  const lastSpan = getLastRowOfLine();
  let newRow;
  if (["space", "tab"].includes(code)) {
    //check if last span contains space or tab use that else append new
    newRow = addNonBreakingSpace({ lastSpan, row });
  } else if (isValidKey) {
    newRow = addText({ lastSpan, row, event });
  } else if (code === "backspace") {
    newRow = onBackspace({ lastSpan, row });
  }
  updateTextCursor(newRow || lastSpan);
});
function addNonBreakingSpace({ lastSpan, row }) {
  if (lastSpan.innerHTML.includes("&nbsp;")) {
    lastSpan.innerHTML += "&nbsp;";
  } else {
    const s = span();
    s.setAttribute("content", !!1);
    s.innerHTML = "&nbsp";
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
    return getLastRowOfLine();
  }
  const sliceIdx = wasSpaceLast(lastSpan) ? 6 : 1;
  lastSpan.innerHTML = lastSpan.innerHTML.slice(0, len - sliceIdx);
  if (!!!lastSpan.innerHTML.length && row.children.length > 1) {
    lastSpan.remove();
    return getLastRowOfLine();
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
    s.setAttribute("content", !!1);
    row.appendChild(s);
    return row;
  }
  lastSpan.innerHTML += event.key;
}
function updateTextCursor() {
  TEXT_CURSOR.style.left = "0px"; //`${e.clientX - spanE.getBoundingClientRect().left}px`;
  TEXT_CURSOR.style.top = `${activeRowIndex * 15}px`; //`${e.clientY - spanE.getBoundingClientRect().top}px`;
}
function updateTextCursor() {
  const spanTextElement = getLastRowOfLine();
  TEXT_CURSOR.style.top = `${activeRowIndex * 15}px`;
  TEXT_CURSOR.style.left =
    spanTextElement.offsetLeft + spanTextElement.offsetWidth + "px";
}
