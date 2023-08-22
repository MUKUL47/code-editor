let activeRowIndex = -1;
let finalRowIndex = -1;
const IDE = window["ide"];
function span() {
  return document.createElement("span");
}
function newRow(n) {
  const r = document.createElement("div");
  r.style.top = `${n * 20}px`;
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
document.body.appendChild;
// IDE.appendChild(textCursor());
// const TEXT_CURSOR = this["text-pipe"];
function addNewLine() {
  IDE.appendChild(newRow(++activeRowIndex));
  finalRowIndex = activeRowIndex;
  const s = span();
  s.setAttribute("content", !!1);
  IDE.children[activeRowIndex].appendChild(s);
}
addNewLine();
IDE.addEventListener("click", (e) => {
  activeRowIndex = e.target.getAttribute("row-index") ?? finalRowIndex;
  if (e.srcElement?.hasAttribute("content")) {
    addTextCursor(e, e.srcElement);
  }
});
window.addEventListener("keydown", (event) => {
  const code = event.code.toLowerCase(); //Alt Space
  if (code === "enter") return addNewLine();
  const keyCode = event.keyCode || event.which;
  const isValidKey = keyCode >= 32 && keyCode <= 126;
  //get latest span and append the key;
  const row = document.querySelector(`div[row-index="${activeRowIndex}"]`); //IDE.children[activeRowIndex];
  const lastSpan = row.children[row.children.length - 1];
  if (["space", "tab"].includes(code)) {
    //check if last span contains space or tab use that else append new
    addNonBreakingSpace({ lastSpan, row });
    moveCursor(3);
  } else if (isValidKey) {
    addText({ lastSpan, row, event });
    moveCursor(3);
  }
});
function addNonBreakingSpace({ lastSpan, row }) {
  if (lastSpan.innerHTML.includes("&nbsp;")) {
    lastSpan.innerHTML += "&nbsp;";
  } else {
    const s = span();
    s.setAttribute("content", !!1);
    s.innerHTML = "&nbsp";
    row.appendChild(s);
  }
}
function addText({ lastSpan, row, event }) {
  const wasSpace = lastSpan.innerHTML.slice(lastSpan.innerHTML.length - 6);
  if (wasSpace === "&nbsp;") {
    const s = span();
    s.innerHTML = event.key;
    s.setAttribute("content", !!1);
    row.appendChild(s);
    return;
  }
  lastSpan.innerHTML += event.key;
}
function addTextCursor(e, spanE) {
  document.getElementById("text-pipe")?.remove();
  const textCursor = span();
  textCursor.className = "text-pipe";
  textCursor.id = "text-pipe";
  textCursor.textContent = "|";
  textCursor.style.position = "absolute";
  textCursor.style.left = `${e.clientX - spanE.getBoundingClientRect().left}px`;
  textCursor.style.top = `${e.clientY - spanE.getBoundingClientRect().top}px`;
  document.body.appendChild(textCursor);
}
function moveCursor(len) {
  const textCursor = document.getElementById("text-pipe");
  if (!textCursor) return;
  textCursor.style.left = `${
    Number(textCursor.style.left.replace("px", "")) + len
  }px`;
}

const divElement = document.getElementById("ide");

// Remove user-select:none when the mouse enters the div
// divElement.addEventListener("mouseenter", function () {
//   divElement.style.userSelect = "auto";
// });

// // Apply user-select:none again when the mouse leaves the div
// divElement.addEventListener("mouseleave", function () {
//   divElement.style.userSelect = "none";
// });

// Listen for the select event
divElement.addEventListener("select", function (event) {
  const selectedText = window.getSelection().toString();
  console.log("Selected text:", selectedText);
});
