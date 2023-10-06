const constants = Object.freeze({
  TEXT_SELECTION: "text-selection",
  START_SLICE_IDX: "startsliceidx",
  END_SLICE_IDX: "endsliceidx",
  ROW_INDEX: "row-index",
  ROW_ORIGINAL_INDEX: "row-original-index",
  CLASS_NEW_LINE: "newline",
  TEXT_SELECTION_DIR: {
    xAxis: "xAxis",
    up: "up",
    down: "down",
  },
  KEYSTROKES_COUNT: {
    DEFAULT: 1,
    TAB: 3,
  },
  KEYSTROKES: {
    TAB: "tab",
    SPACE: "space",
  },
  ARROW: {
    _: "Arrow",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    DOWN: "ArrowDown",
    UP: "ArrowUp",
  },
  KEYBOARD_SPECIALS: {
    CONTROL: "control",
    ENTER: "enter",
    BACKSPACE: "backspace",
  },
});
export { constants };
