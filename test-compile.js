class Compiler {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    this.compile(this.$el);
  }
  compile(node) {
    const nodeList = node.childNodes;
    nodeList.forEach(node => {
      if (this.isElement(node)) {
        this.compileElement(node);
      }
      if (this.isInter(node)) {
        this.compileText(node);
      }
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  compileElement(node) {
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach(attr => {
      const nodeName = attr.nodeName;
      const nodeVal = attr.value;
      if (this.isDirective(nodeName)) {
        const dir = nodeName.substring(2);
        this.update(node, nodeVal, dir);
      }
    });
  }
  compileText(node) {
    this.update(node, RegExp.$1, "text");
  }
  update(node, exp, type) {
    const fn = this[type + "Updater"];
    fn && fn(node, this.$vm[exp]);

    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val);
    });
  }
  isDirective(attr) {
    return attr.indexOf("k-") === 0;
  }
  textUpdater(node, val) {
    node.textContent = val;
  }
  htmlUpdater(node, val) {
    node.innerHTML = val;
  }
}
