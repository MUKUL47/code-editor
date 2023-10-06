export class VirtualList {
  constructor({
    containerSize,
    cellHeight,
    dataLength,
    overscan = 10,
    parentNode,
    scrollNode,
    getNode = () => null,
  }) {
    this.containerSize = containerSize;
    this.cellHeight = cellHeight;
    this.dataLength = dataLength;
    this.endIndex = Math.round(containerSize / cellHeight);
    this.overscan = overscan;
    this.scrollNode = scrollNode;
    this.parentNode = parentNode;
    this.getNode = getNode;
    this.parentNode.style.top = `${this.containerSize}px`;
    this.scrollNode.style.height = `${this.cellHeight * dataLength}`;
    this.#update(true);
    this.#initListener();
  }
  #initListener() {
    this.parentNode?.addEventListener("scroll", this.#onScroll);
  }
  destroy() {
    this.parentNode?.removeEventListener("scroll", this.#onScroll);
  }
  #getIterable(isInit, scrollTo) {
    if (isInit) return [0, this.endIndex + (this.overscan || 0)];
    const startIndex =
      scrollTo === undefined
        ? Math.round(
            Math.abs(this.scrollNode.getBoundingClientRect().top) /
              this.cellHeight
          )
        : scrollTo;
    return [
      startIndex - (this.overscan || 0),
      startIndex + this.endIndex + (this.overscan || 0),
    ];
  }
  #update(isInit, scrollTo) {
    const [from, until] = this.#getIterable(isInit, scrollTo);
    this.scrollNode.innerHTML = "";
    for (let i = from; i < until; i++) {
      const node = this.getNode?.(i);
      if (!node) return;
      node.style.height = `${this.cellHeight}px`;
      node.style.top = `${this.cellHeight * i}px`;
      node.style.position = "absolute";
      this.scrollNode.append(node);
    }
  }
  #onScroll = () => {
    this.#update();
  };
}
