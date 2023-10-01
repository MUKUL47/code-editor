function updateLineNumber() {
  LINE_NUMBER.innerHTML = "";
  for (let i = 0; i < IDE.children.length; i++) {
    const e = E("div", {
      style: {
        position: "absolute",
        top: px(ROW_HEIGHT * i),
      },
      data: {
        innerHTML: i + 1,
      },
    });
    LINE_NUMBER.append(e);
  }
}
