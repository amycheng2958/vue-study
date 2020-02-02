# 数据响应式原理

* 实现只有一个key的obj的响应式
* 实现多个key的obj的响应式（循环遍历属性名）
* 实现key的值为object的响应式（递归）
* 实现设置key的val为obj的响应式（递归）
* 实现新增的key的响应式
* 实现数组的响应式


* 实现kvue类，创建Observer（分辨数据是对象还是数组）实例对kvue实例中的data设置响应式
* 实现代理，简化vue实例对data的访问
* 编译：插值文本解析，指令解析(类数组和Array.from())
* 事件解析
* 创建wather类，实现key变化能更新所有节点
* 创建dep


# 源码剖析

* 查找入口文件，从package.json开始,覆盖$mount，执行模板解析和编译工作(platforms/web/entry-runtime-with-compiler.js)
* 定义$mount方法(platforms/web/runtime/index.js)
* 定义全局api(core/index.js)
* vue构造函数里面的init方法(core/instance/init.js)