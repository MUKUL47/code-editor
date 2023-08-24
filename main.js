addNewLine();
IDE.addEventListener("click", (e) => {
  updateActiveRowIdx(e);
});
window.addEventListener("keydown", (event) => {
  const code = event.code.toLowerCase(); //Alt Space
  const keyCode = event.keyCode || event.which;
  switch (!!1) {
    case ["space", "tab"].includes(code):
      return addNonBreakingSpace(event);
    case keyCode >= 32 && keyCode <= 126:
      return addText(event);
    case code === "backspace":
      return onBackspace(event);
    case code === "enter":
      return updateOrAddNewLine();
  }
});

function updateTextCursor(customCoords) {
  const { left } = customCoords || {};
  const spanTextElement = getLastRowChild();
  TEXT_CURSOR.style.top = `${activeRowIndex * 15}px`;
  TEXT_CURSOR.style.left = customCoords
    ? left + "px"
    : spanTextElement.offsetLeft + spanTextElement.offsetWidth + "px";
}
function textCursor() {
  const s = span();
  s.className = "text-pipe";
  s.id = "text-pipe";
  s.textContent = "|";
  s.style.position = "absolute";
  return s;
}
