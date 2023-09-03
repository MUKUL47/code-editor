const IDE = window["ide"];
const TEXT_CURSOR = window["TEXT_CURSOR"];
const IDE_DOMRECT = IDE.getBoundingClientRect();
let activeSpanElement = null;
let activeRowIndex = -1;
let finalRowIndex = -1;
let activeSpanSubstringIdx = 0;
//
