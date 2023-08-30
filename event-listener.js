addNewLine();
IDE.addEventListener("click", (e) => {
  updateActiveRowIdx(e);
  updateTextCursor();
  addTextCursor(e);
});
document.addEventListener("click", () => {});
window.addEventListener("keydown", (event) => {
  const code = event.code.toLowerCase(); //Alt Space
  const keyCode = event.keyCode || event.which;
  switch (!!1) {
    case ["space", "tab"].includes(code):
      activeSpanElement = onSpace(event);
      break;
    case keyCode >= 32 && keyCode <= 126:
      activeSpanElement = onKeystroke(event);
      break;
    case code === "backspace":
      activeSpanElement = onBackspace(event);
      break;
    case code === "enter":
      activeSpanElement = updateOrAddNewLine();
      break;
  }
  updateTextCursorOnEvent();
});
