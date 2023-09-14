const main = () => {
  addNewLine();
  window.addEventListener("keydown", (event) => {
    const code = event.code.toLowerCase(); //Alt Space
    const keyCode = event.keyCode || event.which;
    const key = event.key;
    let eventResponse = {};
    switch (!!1) {
      case key.includes(constants.ARROW._):
        eventResponse = onArrowMovement(event) || {};
        break;
      case [constants.KEYSTROKES.SPACE, constants.KEYSTROKES.TAB].includes(
        code
      ):
      case keyCode >= 32 && keyCode <= 126:
        eventResponse = onKeystroke(event) || {};
        break;
      case code === constants.KEYBOARD_SPECIALS.BACKSPACE:
        eventResponse = onBackspace(event) || {};
        break;
      case code === constants.KEYBOARD_SPECIALS.ENTER:
        eventResponse = updateOrAddNewLine() || {};
        break;
    }
    if (!!!eventResponse.disableSelectionReset) {
      removePreviousTextSelection();
    }
    updateTextCursorOnEvent();
  });
  IDE.addEventListener("mousedown", (e) => onMouseDown(e));
  IDE.addEventListener("mousemove", (e) => onMouseMove(e));
  IDE.addEventListener("mouseup", (e) => onMouseUp(e));
};

document.addEventListener("DOMContentLoaded", main);
