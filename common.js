function E(e, properties = {}) {
  const ele = document.createElement(e);
  if (properties.attributes) {
    for (let a in properties.attributes || {}) {
      ele.setAttribute(a, properties.attributes[a]);
    }
  }
  if (properties.style) {
    for (let s in properties.style) {
      ele.style[s] = properties.style[s];
    }
  }
  ele.id = properties.id || "";
  ele.className = properties.class || "";
  return ele;
}
function wasSpaceLast(e) {
  return e.innerHTML?.slice(e?.innerHTML.length - 6) === "&nbsp;";
}
