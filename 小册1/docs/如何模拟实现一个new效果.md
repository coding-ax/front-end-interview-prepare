# 如何模拟实现一个new效果

对于一个new，它做了如下四件事情

new主要做了以下四件事情*

1. 创建一个新对象

2. 将该对象的`__proto__`挂载到函数的`prototype`属性上

3. 将函数的this指针绑定到该对象上

4. 执行函数 如果函数返回值不是一个引用类型 那就返回这个新对象 否则返回函数自身的返回值

```js
   function newFactory(func, ...args) {
            // 类型判断
            if (typeof func !== "function") {
                throw new TypeError("func is not a function")
            }
            // 创建新对象
            let obj = {};
            // 将新对象的__proto__属性挂载到函数的prototype上
            obj.__proto__ = func.prototype;
            // 将函数的this指针指向该对象
            const result = func.apply(obj, args);
            if (result instanceof Object) {
                return result;
            } else {
                return obj;
            }
        }

		//测试
        function Person(name, age) {
            this.name = name;
            this.age = age;
            console.log(`hi I am ${this.name} and I am ${this.age} years old`);
        }
        // 正常的Person new调用
        let obj1 = new Person("AX", 20);
        // 通过手写的new调用
        let obj2 = newFactory(Person, "ax", 21);
        console.log(obj1);
        console.log(obj2);
```

结果：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f83a395e8d3f4e6f925a0a134df29ddf~tplv-k3u1fbpfcp-zoom-1.image)

