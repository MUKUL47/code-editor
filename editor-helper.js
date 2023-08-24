function newRow(n) {
  return E("div", {
    style: {
      top: `${n * 15}px`,
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
  const children = IDE.children[idx == undefined ? activeRowIndex : idx];
  return children;
}
function addNewLine() {
  const e = newRow(++activeRowIndex);
  IDE.appendChild(e);
  finalRowIndex = activeRowIndex;
  addNewTextSpan();
  return e;
}
function addNewTextSpan() {
  const s = E("span", {
    attributes: {
      content: !!1,
      index: 0,
    },
  });
  getLineRow()?.appendChild(s);
  return s;
}
function getLastRowChild(idx) {
  const row = getLineRow(idx);
  const nodes = row.querySelectorAll("span");
  return nodes?.[nodes.length - 1];
}

function updateOrAddNewLine() {
  if (activeRowIndex === finalRowIndex) {
    addNewLine();
  } else {
    activeRowIndex++;
  }
  updateTypeSpanCommands.newLine();
}
const updateTypeSpanCommands = {
  newLine: () => {
    activeTypeSpanIdx = 0;
    activeTypeSpanIdy += 1;
  },
  newSpan: () => {
    activeTypeSpanIdx += 1;
  },
  backspace: () => {
    activeTypeSpanIdx =
      activeTypeSpanIdx > 0 ? activeTypeSpanIdx - 1 : activeTypeSpanIdx;
  },
  backspaceAndClear: () => {
    activeTypeSpanIdx = 0;
    activeTypeSpanIdy =
      activeTypeSpanIdy > 0 ? activeTypeSpanIdy - 1 : activeTypeSpanIdy;
  },
};
function generateTextCursor() {
  document.getElementById("text-pipe")?.remove();
  const e = E("div", {
    id: "text-pipe",
    class: "text-pipe",
  });
  e.textContent = "|";
  return e;
}
