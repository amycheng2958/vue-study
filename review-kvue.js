function defineReactive(obj, key, val) {
  observe(val);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    set(newval) {
      if (newval !== val) {
        console.log("set" + key + newval);
        observe(newval);
        val = newval;
        // watchers.forEach(w => {
        //   w.update();
        // });
        dep.notify();
      }
    },
    get() {
      console.log("get" + key + JSON.stringify(val));
      // 依赖收集
      Dep.target && dep.addDep(Dep.target);
      return val;
    }
  });
}
class KVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    // 给data设置set和get属性
    observe(options.data);
    // 代理
    proxy(this, "$data");
    // 编译
    new Compiler(options.el, this);
  }
}
function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
}
function proxy(vm, sourceKey) {
  Object.keys(vm[sourceKey]).forEach(key => {
    defineReactive(vm, key, vm[sourceKey][key]);
  });
}
// const watchers = [];
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;
    // watchers.push(this);
    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach(dep => {
      dep.update();
    });
  }
}
