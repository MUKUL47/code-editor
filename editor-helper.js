function newRow(n) {
  return E("div", {
    style: {
      top: `${n * ROW_HEIGHT}px`,
    },
    attributes: {
      "row-index": n,
    },
    class: "newline",
  });
}
function getSpanChildren(idx) {
  //ROW -> SPAN
  const row = getLineRow(idx);
  return row.querySelectorAll("span");
}
function getLineRow(idx) {
  //IDE -> ROW[ACTIVE]
  return IDE.children[idx == undefined ? activeRowIndex : idx];
}
function addNewLine() {
  const e = newRow(++activeRowIndex);
  IDE.appendChild(e);
  activeSpanElement = addNewTextSpan();
  return e;
}
function addNewTextSpan(data) {
  const s = createNewSpan(data);
  getLineRow()?.appendChild(s);
  return s;
}
function getLastRowChild(idx) {
  const row = getLineRow(idx);
  const nodes = row.querySelectorAll("span");
  return nodes?.[nodes.length - 1];
}

function generateTextCursor() {
  document.getElementById("text-pipe")?.remove();
  const e = E("div", {
    id: "text-pipe",
    class: "text-pipe",
  });
  e.textContent = "|";
  return e;
}
function getSpanIndex(span, rowIndex) {
  return [...getSpanChildren(rowIndex)].findIndex((s) => s === span);
}

function getTextSplits(text) {
  return text.split(/(\s+|\.|\(|\))/).filter(String);
}

function appendSpansToRow(row, spans) {
  [...row.children].forEach((span) => span.remove());
  spans.forEach((span) => row.append(span));
}

let rowsData = new Map();
function constructRowSpans(row, newRowText) {
  //DO NOT USE REGEX TRAVERSAL STRING NORMALLY
  const spans = getTextSplits(newRowText);
  row.innerHTML = "";
  let previousDataCount = 0;
  rowsData.set(activeRowIndex, {});
  for (let i = 0; i < spans.length; i++) {
    const split = spans[i];
    const data = split.includes(" ")
      ? Array(split.length).fill("&nbsp;").join("")
      : split;
    const e = createNewSpan(data);
    e.setAttribute("i", i);
    e.setAttribute("len", split.length);
    e.setAttribute("prevLength", previousDataCount);
    previousDataCount += split.length;
    row.append(e);
  }
  if (row.children.length === 0) {
    row.append(createNewSpan(""));
  }
}

function removePreviousSelection(from) {
  TEXT_SELECTION.innerHTML = "";
}

function reconstructRow(row) {
  constructRowSpans(row, row.innerText);
}
