import { updateTextCursorOnEvent } from "./src/cursor/text-cursor";
import {
  onArrowMovement,
  onBackspace,
  onKeystroke,
  updateLastShiftKey,
  updateOrAddNewLine,
} from "./src/keyboard";
import { updateLineNumber } from "./src/line-number/line-number";
import {
  onMouseDown,
  onMouseMove,
  onMouseUp,
} from "./src/selection/text-selection";
import { constants } from "./src/state";
import { IDEManagerState } from "./src/state/ide-state";
import {
  addNewLine,
  initializeEditorDom,
  removePreviousTextSelection,
} from "./src/util";

const main = (e) => {
  // initializeEditorDom(e);
  addNewLine();
  updateLineNumber();
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
    updateLastShiftKey(event);
    updateTextCursorOnEvent();
    updateLineNumber();
  });
  IDE.addEventListener("mousedown", onMouseDown);
  IDE.addEventListener("mousemove", onMouseMove);
  IDE.addEventListener("mouseup", onMouseUp);
  IDE.addEventListener("click", () => {
    if (!!!mouseMoveTime) {
      removePreviousTextSelection();
    }
  });
};
document.addEventListener("DOMContentLoaded", () => main("code_editor"));
