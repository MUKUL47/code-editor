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
function getLineRow(idx) {
  return document.querySelector(
    `div[row-index="${idx == undefined ? activeRowIndex : idx}"]`
  );
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
  return row?.children?.[row.children.length - 1] || [];
}

function updateOrAddNewLine() {
  if (activeRowIndex === finalRowIndex) {
    addNewLine();
  } else {
    activeRowIndex++;
  }
}
