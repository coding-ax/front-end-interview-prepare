# Array.from的作用以及通过Array.from递归实现深拷贝
## 一、作用
Array.from:将一个可迭代对象转换为数组并将其返回
## 二、参数说明
第一个参数 目标迭代对象 第二个参数map函数(作用同map) 第三个参数map回调使用的this对象
## 三、Array.from的浅拷贝
### 浅拷贝概念与原理
浅拷贝：在JavaScript语言中，数据类型被定义在栈和堆中，其中基本数据类型：`Number`,`String`,`Symbol`,`BigInt`,`undefined`,`null`都是定义在栈上，对其进行赋值和修改操作都是直接在栈上进行操作。
而唯一的引用数据类型:`object`在使用的时候是：先在堆里开辟一片空间用于存放其数据，随后在栈上开辟一个指针并将其指向堆里开辟的空间。
```js
let obj = {
	a:1
};
```
如上所示的代码，实际上obj变量中，存的是一个指针，这个指针指向堆中存放的代表`{a:1}`的底层二进制数据
浅拷贝，也就是变量赋值时，仅是复制了一份程序栈中的指针（地址），而非在堆里重新申请空间，这样，当我们改变堆里数据的属性，就会改变所有指针指向其中的变量。
```js
let obj1 = {
	a:1
};
let obj2 = obj1;
obj2.b = 2;
console.log(obj===obj2) //true
console.log(obj1); //{a:1,b:2}
console.log(obj2); //{a:1,b:2}
```

### 浅拷贝在Array.from中的体现
使用Array.from直接返回的数组，基本数据类型是拷贝了一份，不会被影响。但是数组内部的引用数据类型是浅拷贝，也就是拷贝下来的仍然是一个指针，而非在堆栈上创建一个新数组，当对其进行更改时会影响到另一个对象的数据元素
```js
        console.log('--------我是一条分割线:浅拷贝第一次打印---------');
        let arr1 = [1, [2, 3], [4, 5]];
        let newArr1 = Array.from(arr1);
        console.log(arr1);
        console.log(newArr1);
        // 避免因为console.log打印的异步特性导致打印成同一个模样
        setTimeout(() => {
            console.log('--------我是一条分割线:浅拷贝第二次打印---------');
            // 进行操作
            arr1.push(6);
            arr1[1].push(4);
            newArr1.push(0);
            newArr1[2].push(9);
            // 打印更改后的数据检测是否是深拷贝
            console.log(arr1);
            console.log(newArr1);
        }, 500)
```
结果：
[![](https://xgpax.top/wp-content/uploads/2020/10/wp_editor_md_ac194e4900a8ccac1886646504ab7441.jpg)](https://xgpax.top/wp-content/uploads/2020/10/wp_editor_md_ac194e4900a8ccac1886646504ab7441.jpg)

### 利用第二个参数递归实现深拷贝
```js
console.log('--------我是一条分割线：深拷贝第一次打印---------');
        // 如何使用Array.from实现一个深拷贝?
        function deepClone(val) {
            return Array.isArray(val) ? Array.from(val, deepClone) : val
        }
        let arr = [1, [2, 3], [4, 5]];
        let newArr = Array.from(arr, deepClone);
        console.log(arr);
        console.log(newArr);
        // 避免因为console.log打印的异步特性导致打印成同一个模样
        setTimeout(() => {
            console.log('--------我是一条分割线：深拷贝第二次打印---------');
            // 进行操作
            arr.push(6);
            arr[1].push(4);
            newArr.push(0);
            newArr[2].push(9);
            // 打印更改后的数据检测是否是深拷贝
            console.log(arr);
            console.log(newArr);
        }, 1000)
```

结果：
![](https://xgpax.top/wp-content/uploads/2020/10/UH755YB22RKDACPD1Z.png)