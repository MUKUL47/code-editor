export class IDEManagerState {
  virtualList;

  constructor({ virtualListArgs }) {
    this.IDE = window["ide"];
    this.TEXT_CURSOR = window["TEXT_CURSOR"];
    this.IDE_DOMRECT = this.IDE.getBoundingClientRect();
    this.activeRowIndex = -1;
    this.finalRowIndex = -1;
    this.activeSpanSubstringIdx = 0;
    this.ROW_HEIGHT = 15;
    this.ideMouseDownX = -1;
    this.ideMouseDownY = -1;
    this.ideMouseUpX = -1;
    this.ideMouseUpY = -1;
    this.mouseUp = true;
    this.lastYAxisMovement = -1;
    this.textSelectionDirection = null;
    this.newLineCounter = -1;
    this.originalShiftKeyboardSpanE = null;
    this.originalShiftKeyboardRowIdx = null;
    this.LINE_NUMBER = window["line-number"];
    this.mouseMoveTime = false;
    this.virtualList = new VirtualList(...virtualListArgs);
  }

  set IDE(value) {
    this.IDE = value;
  }

  set TEXT_CURSOR(value) {
    this.TEXT_CURSOR = value;
  }

  set IDE_DOMRECT(value) {
    this.IDE_DOMRECT = value;
  }

  set activeRowIndex(value) {
    this.activeRowIndex = value;
  }

  set finalRowIndex(value) {
    this.finalRowIndex = value;
  }

  set activeSpanSubstringIdx(value) {
    this.activeSpanSubstringIdx = value;
  }

  set ROW_HEIGHT(value) {
    this.ROW_HEIGHT = value;
  }

  set ideMouseDownX(value) {
    this.ideMouseDownX = value;
  }

  set ideMouseDownY(value) {
    this.ideMouseDownY = value;
  }

  set ideMouseUpX(value) {
    this.ideMouseUpX = value;
  }

  set ideMouseUpY(value) {
    this.ideMouseUpY = value;
  }

  set mouseUp(value) {
    this.mouseUp = value;
  }

  set lastYAxisMovement(value) {
    this.lastYAxisMovement = value;
  }

  set textSelectionDirection(value) {
    this.textSelectionDirection = value;
  }

  set newLineCounter(value) {
    this.newLineCounter = value;
  }

  set originalShiftKeyboardSpanE(value) {
    this.originalShiftKeyboardSpanE = value;
  }

  set originalShiftKeyboardRowIdx(value) {
    this.originalShiftKeyboardRowIdx = value;
  }

  set LINE_NUMBER(value) {
    this.LINE_NUMBER = value;
  }

  set mouseMoveTime(value) {
    this.mouseMoveTime = value;
  }
}
