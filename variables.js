const IDE = window["ide"];
const TEXT_CURSOR = window["TEXT_CURSOR"];
const IDE_DOMRECT = IDE.getBoundingClientRect();
let activeSpanElement = null;
let activeRowIndex = -1;
let finalRowIndex = -1;
let activeSpanSubstringIdx = 0;
//
const ROW_HEIGHT = 15;

let ideMouseDownX = -1;
let ideMouseDownY = -1;
let ideMouseUpX = -1;
let ideMouseUpY = -1;
let mouseUp = true;
let lastYAxisMovement = -1;
let textSelectionDirection = null;

let newLineCounter = -1;

let rowLineMap = new Map();
