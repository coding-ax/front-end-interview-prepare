# 如何手写一个call,apply以及bind

首先我们对于call,apply以及bind三个函数的区别已经做了分析，具体请查看前文

| 函数  | 参数形式                                                     | 返回值                                                       |
| ----- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| call  | 第一个参数为this要指向的对象，后面的参数同函数保持一致即可。 | 立即执行，返回值即函数返回值。                               |
| apply | 第一个参数为this要指向的对象，第二个参数为组织成数组形式的函数参数列表。 | 立即执行，返回值即函数返回值。                               |
| bind  | 第一个参数为this要指向的对象，后面的参数同函数保持一致即可。 | 返回一个绑定好第一个参数和后序参数的函数，需要接收然后再执行。 |



## 1.手写call

**改变this的核心思想**在于：**谁调用函数，this指向谁。**

所以我们需要为传入的对象绑定上一个fn属性，这个fn属性指向要执行的函数。

然后通过obj.fn()的形式调用，这样this也就指向了当前传入的obj对象。

```js
 // 手写一个call
        Function.prototype.myCall = function (context) {
            if (typeof this !== "function") {
                throw new TypeError("this isn't a function");
            }
            // 如果context为空 就默认指向window
            context = context || window;
            // 将函数（因为此时是Function.prototype调用的函数，所以this指向的就是该函数）挂载到对象上
            context.fn = this;
            // 获取参数
            let args = Array.from(arguments).slice(1);
            // 执行并拿到返回结果
            let result = context.fn(...args);
            // 清除其属性
            delete context.fn;
            // 返回结果
            return result;
        }
        let obj = {
            name: "ax"
        }
        function print(...args) {
            console.log(this);
            console.log(...args)
            console.log(this.name);
        }
        print.myCall(obj, "name", "mydear");
```

结果:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ba7a2b7dd484255b0437f2dab667db6~tplv-k3u1fbpfcp-zoom-1.image)

## 2.手写apply

apply和call的区别就在于参数的处理：

```js
        Function.prototype.myApply = function (context) {
            if (typeof this !== "function") {
                throw new TypeError("this is not function")
            }
            // 获取当前的context
            context = context || window;
            // 判断参数
            let args = null;
            if (arguments[1] != null) {
                args = arguments[1];
            } else {
                args = [];
            }
            // 挂载函数
            context.fn = this;
            let result = context.fn(...args);
            //移除属性
            delete context.fn;
            return result;
        }
        let obj = {
            name: "ax"
        }
        function print(...args) {
            console.log(this);
            console.log(...args)
            console.log(this.name);
        }
        print.myApply(obj, "ok", "test");
```



## 3.手写bind

bind的返回结果是一个函数，而函数的调用有两种方式：

一种是直接调用，另一种则是通过new调用，这里需要进行不同的处理

```js
  // bind返回的是一个函数 而函数的调用有两种方式
        // 第一种是直接调用，另一种则是通过new调用
        // 而在这两种方式中，如果使用new调用，那么当前的this指向的就是这个函数对象||函数返回对象
        // 对于这种情况 我们不需要再为其绑定this，因为this已经指向了其要指向的目标

        // context :要bind的对象
        Function.prototype.myBind = function (context) {
            if (typeof this !== "function") {
                throw new TypeError("this is not a function");
            }
            // bind的返回值是一个函数 这个函数可以通过new调用，也可以直接调用
            // 提取bind的参数,因为第一个是context对象 所以需要分割
            const args = Array.from(arguments).slice(1);
            // 获取context,如果没有就指向为window
            context = context || window;
            // 用_this变量保存当前的函数（在当前作用域this指向的就是函数体本身）
            const _this = this;
            return function F() {
                // 返回的函数中 如果this的原型链上有F，说明是通过new进行调用的，那么我们不需要为其绑定this
                // 否则就是直接调用，那么我们需要为其绑定this
                if (this instanceof F) {
                    return _this(...args);
                } else {
                    return _this.apply(context, args);
                }
            }
        }

        // 测试用例
        function print(name, age) {
            if (name && age) {
                this.name = name;
                this.age = age;
            }
            console.log(`hi,I am ${this.name},I am ${this.age} years old!`);
        }
        let obj = {
            name: "ax",
            age: 20
        }
        let obj2 = {
            name: "kime",
            age: 19
        }
        // 直接调用
        console.log( obj) //{name: "ax", age: 20}
        let f1 = print.myBind(obj);
        f1(); //hi,I am ax,I am 20 years old!
        // 直接调用参数改变
        f2 = print.myBind(obj, "AX", 21);
        // 执行f
        f2();//hi,I am AX,I am 21 years old!
        // 打印看obj是否也发生了变化:确实发生了变化
        console.log(obj);//{name: "AX", age: 21}

        //通过new调用
        let f3 = print.myBind(obj, "AX", 30);
        let funcObj = new f3();
        console.log(funcObj)
```

