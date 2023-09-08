const main = () => {
  addNewLine();
  window.addEventListener("keydown", (event) => {
    removePreviousSelection();
    const code = event.code.toLowerCase(); //Alt Space
    const keyCode = event.keyCode || event.which;
    const key = event.key;
    switch (!!1) {
      case ["space", "tab"].includes(code):
        onSpaceTab(event);
        break;
      case key.includes("Arrow"):
        onArrowMovement(event);
        break;
      case keyCode >= 32 && keyCode <= 126:
        onKeystroke(event);
        break;
      case code === "backspace":
        onBackspace(event);
        break;
      case code === "enter":
        updateOrAddNewLine();
        break;
    }
    updateTextCursorOnEvent();
  });
  IDE.addEventListener("mousedown", (e) => onMouseDown(e));
  IDE.addEventListener("mousemove", (e) => onMouseMove(e));
  IDE.addEventListener("mouseup", (e) => onMouseUp(e));
};

document.addEventListener("DOMContentLoaded", main);
