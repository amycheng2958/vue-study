class Compiler {
  constructor(el, vm) {
    this.$el = document.querySelector(el);
    this.$vm = vm;
    this.compile(this.$el);
  }
  compile(el) {
    const nodeList = el.childNodes;
    Array.from(nodeList).forEach(node => {
      if (this.isElement(node)) {
        this.compileElement(node);
      } else if (this.isInter(node)) {
        this.compileText(node);
      }
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }
  isElement(node) {
    // Element节点
    return node.nodeType === 1;
  }
  isInter(node) {
    // Text节点
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  update(node, exp, dir) {
    //   初始化操作
    // 指令对应的更新函数
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);
    // 更新操作
    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val);
    });
  }
  compileText(node) {
    // node.textContent = this.$vm[RegExp.$1];
    this.update(node, RegExp.$1, "text");
  }
  textUpdater(node, val) {
    node.textContent = val;
  }
  htmlUpdater(node, val) {
    node.innerHTML = val;
  }
  compileElement(node) {
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name;
      const exp = attr.value;
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2);
        this[dir] && this[dir](node, exp);
      }
    });
  }
  isDirective(attrName) {
    return attrName.indexOf("k-") === 0;
  }
  text(node, exp) {
    // node.textContent = this.$vm[exp];
    this.update(node, exp, "text");
  }
  html(node, exp) {
    this.update(node, exp, "html");
    // node.innerHTML = this.$vm[exp];
  }
}
