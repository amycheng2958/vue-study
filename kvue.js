function defineReactive(obj, key, val) {
  observe(val);
  Object.defineProperty(obj, key, {
    set(newval) {
      if (newval !== val) {
        observe(newval);
        val = newval;
        watchers.forEach(w => {
          w.update();
        });
      }
    },
    get() {
      return val;
    }
  });
}
// defineReactive(obj,'name',obj['name'])
function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  // 判断数据类型
  new Observer(obj);
}
function proxy(vm, sourceKey) {
  Object.keys(vm[sourceKey]).forEach(key => {
    // 将$data中的key代理到vm属性中
    Object.defineProperty(vm, key, {
      get() {
        return vm[sourceKey][key];
      },
      set(newval) {
        vm[sourceKey][key] = newval;
      }
    });
  });
}
class KVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    // 数据响应式
    observe(this.$data);
    // 代理
    proxy(this, "$data");
    // 编译
    new Compiler(options.el, this);
  }
}
class Observer {
  constructor(value) {
    this.value = value;
    if (typeof value === "object") {
      this.walk(value);
    }
  }
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    });
  }
}
// 观察者
const watchers = [];
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;
    watchers.push(this);
  }
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
