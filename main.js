const main = () => {
  addNewLine();
  window.addEventListener("keydown", (event) => {
    const code = event.code.toLowerCase(); //Alt Space
    const keyCode = event.keyCode || event.which;
    const key = event.key;
    switch (!!1) {
      case key.includes(constants.ARROW._):
        onArrowMovement(event);
        break;
      case [constants.KEYSTROKES.SPACE, constants.KEYSTROKES.TAB].includes(
        code
      ):
      case keyCode >= 32 && keyCode <= 126:
        onKeystroke(event);
        break;
      case code === constants.KEYBOARD_SPECIALS.BACKSPACE:
        onBackspace(event);
        break;
      case code === constants.KEYBOARD_SPECIALS.ENTER:
        updateOrAddNewLine();
        break;
    }
    removePreviousTextSelection();
    updateTextCursorOnEvent();
  });
  IDE.addEventListener("mousedown", (e) => onMouseDown(e));
  IDE.addEventListener("mousemove", (e) => onMouseMove(e));
  IDE.addEventListener("mouseup", (e) => onMouseUp(e));
};

document.addEventListener("DOMContentLoaded", main);
