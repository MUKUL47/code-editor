addNewLine();
IDE.addEventListener("click", (e) => {
  updateActiveRowIdx(e);
  updateTextCursor();
  addTextCursor(e);
});
window.addEventListener("keydown", (event) => {
  const code = event.code.toLowerCase(); //Alt Space
  const keyCode = event.keyCode || event.which;
  switch (!!1) {
    case ["space", "tab"].includes(code):
      activeSpanElement = addNonBreakingSpace(event);
      break;
    case keyCode >= 32 && keyCode <= 126:
      activeSpanElement = addText(event);
      break;
    case code === "backspace":
      activeSpanElement = onBackspace(event);
      break;
    case code === "enter":
      activeSpanElement = updateOrAddNewLine();
      break;
  }
  console.log(activeSpanElement);
  updateTextCursor();
});
