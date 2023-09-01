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
function constructRowSpans(row, newRowText) {
  //DO NOT USE REGEX TRAVERSAL STRING NORMALLY
  const spans = newRowText.split(/(\s+|\.|\(|\))/).filter(String);
  row.innerHTML = "";
  spans.forEach((split) =>
    row.append(
      createNewSpan(
        split.includes(" ")
          ? Array(split.length).fill("&nbsp;").join("")
          : split
      )
    )
  );
  if (row.innerHTML === "") {
    row.append(createNewSpan(""));
  }
}
