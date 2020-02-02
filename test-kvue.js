function defineReactive(obj, key, val) {
  observe(val);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    set(newval) {
      if (newval !== val) {
        console.log("set", key, newval);
        observe(newval);
        val = newval;
      }
    },
    get() {
      console.log("get", key, val);
      // 依赖收集,初始化data数据设置get属性时不执行此操作，只有在编译模板并创建了watcher实例的时候，才会触发
      Dep.target && dep.addDep(Dep.target);
      return val;
    }
  });
}
// 数据响应化
function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  new Observer(obj);
}

function proxy(vm, sourseKey) {
  Object.keys(vm[sourseKey]).forEach(key => {
    Object.defineProperty(vm, key, {
      set(newval) {
        vm[sourseKey][key] = newval;
      },
      get() {
        return vm[sourseKey][key];
      }
    });
  });
}
class KVue {
  constructor(options) {
    this.$options = options;
    this.$el = options.el;
    this.$data = options.data;
    // 响应式
    observe(options.data);
    // 代理
    proxy(this, "$data");
    // 编译
    new Compiler(this.$el, this);
  }
}
// 根据对象类型，数组还是对象，分别做响应式
class Observer {
  constructor(value) {
    this.value = value;
    if (typeof value === "object") {
      this.walk(value);
    }
  }
  // 对象数据的响应化
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    });
  }
  // 数组数据的响应化,待补充
}
// 保存更新函数，当数据变化时，触发更新函数
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;
    // Dep.target静态属性上设置为当前watcher实例
    Dep.target = this;
    // 读取key,触发了getter
    this.vm[this.key];
    Dep.target = null;
  }
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}
// 收集watchers，执行相对应key的更新函数
class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach(dep => dep.update());
  }
}
