function E(e, properties = {}) {
  const ele = document.createElement(e);
  if (properties.attributes) {
    for (const a in properties.attributes || {}) {
      ele.setAttribute(a, properties.attributes[a]);
    }
  }
  if (properties.style) {
    for (const s in properties.style) {
      ele.style[s] = properties.style[s];
    }
  }
  if (properties.data) {
    for (const data in properties.data) {
      ele[data] = properties.data[data];
    }
  }
  ele.id = properties.id || "";
  ele.className = properties.class || "";
  return ele;
}
function wasSpaceLast(e) {
  return e.innerHTML?.slice(e?.innerHTML.length - 6) === "&nbsp;";
}
