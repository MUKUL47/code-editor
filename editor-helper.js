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
  return IDE.children[idx == undefined ? activeRowIndex : idx];
}
function addNewLine() {
  const e = newRow(++activeRowIndex);
  IDE.appendChild(e);
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
  if (activeRowIndex === IDE.children.length - 1) {
    addNewLine();
  } else {
    // update rest of the columns
    for (let i = Number(activeRowIndex) + 1; i < IDE.children.length; i++) {
      IDE.children[i].style.top = `${(i + 1) * 15}px`;
      IDE.children[i].setAttribute("row-index", i + 1);
    }

    getLineRow().insertAdjacentElement("afterend", newRow(++activeRowIndex));
    addNewTextSpan();
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
