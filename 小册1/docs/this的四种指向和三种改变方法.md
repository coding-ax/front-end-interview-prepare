# this的四种指向和三种改变方法

## 一、this指针：

下面是MDN上关于this指针的表述:

> 当前执行上下文（global、function 或 eval）的一个属性，在非严格模式下，总是指向一个对象，在严格模式下可以是任意值。---MDN

从字面上的意思，this也就是当前对象主体的一个代指。

## 二、this指针在JavaScript中的四种指向：

1. 直接调用的情况下this指向window，即直接调用一个可以直接调用的函数，this指向window
2. 通过new运算符，new这个函数，则this指向当前new出来的函数对象
3. 通过创建一个对象，然后通过对象进行调用，this指向该对象（谁调用，指向谁）
4. 箭头函数中没有this，箭头函数中的this指向的是上下文的this

``` js
  // 1.直接调用的情况下this指向window
  console.log("情况一：this指向window")
  console.log(this); //window
  // 用var 会将name挂载到window
  var name = 'window\'s name'
  // 2.直接调用一个可以直接调用的函数，this指向window
  function print() {
      console.log(this)
      console.log(this.name);
  }
  console.log("情况二：函数中直接调用：this指向window，实质上就是指情况一")
  print();

  console.log("情况三：通过new运算符初始化一个实例，this指向该实例")
  // 3.通过new运算符，new一个对象后再调用
  let pri = new print();

  console.log("情况四：通过创建一个对象，然后通过对象进行调用，this指向该对象（谁调用，指向谁）")
  // 4.对象中使用，this指向该对象（谁调用，指向谁）
  let obj = {
      age: 18,
      name: 'ax',
      print: print
  }
  obj.print();

  // 5.箭头函数 箭头函数中没有this，this指向的是上下文的this
  console.log('情况五：箭头函数中调用this，this指向');
  let obj2 = {
      print: () => {
          console.log(this);
      }
  }
  obj2.print();
```

结果：
[![](https://xgpax.top/wp-content/uploads/2020/10/wp_editor_md_12c89338a0696058e57879c5257a36ef.jpg)](https://xgpax.top/wp-content/uploads/2020/10/wp_editor_md_12c89338a0696058e57879c5257a36ef.jpg)

## 三、通过bind, call, apply三种方式改变某函数的this指向

在JavaScript中有三个函数可以对bind, call, apply进行动态的改变：  
区别：  

* 执行形式上:  

call和apply在使用后会立刻执行函数，而bind则只是绑定this对象，在之后才会调用  

* 传入参数上：  

call, bind, apply第一个传入参数是一致的，都是第一个参数为this要指向的对象，区别在于，call和bind后面的参数都是后续传参，而apply的第二个参数则必须是一个数组

* 箭头函数调用call或者apply方法的时候第一个参数会被忽略！（不能绑定this)

``` js
        // 通过bind call apply可以改变this指针的指向
        // call和apply在使用后会立刻执行函数，而bind则只是绑定this对象，在之后才会调用

        // 1.call：第一个参数是要改变的this指向 后续参数都是其要传入的值
        function print() {
            console.log(this);
            console.log(this.name);
            console.log(arguments);
        }
        var name = "ax"
        let obj = {
            name: 'AX'
        }
        print(19, '计算机类');
        // window
        // ax
        // Arguments(2) [19, "计算机类", callee: ƒ, Symbol(Symbol.iterator): ƒ]
        print.call(obj, 20, '软件工程');
        // {name:'AX'}
        // AX
        // Arguments(2) [20, "软件工程", callee: ƒ, Symbol(Symbol.iterator): ƒ]

        // 2.apply
        print.apply(obj, [21, "前端实习工程师"]);
        // {name: "AX"}
        // AX
        // Arguments(2) [21, "前端工程师", callee: ƒ, Symbol(Symbol.iterator): ƒ]

        // 3.bind
        // bind仅绑定，而不会立即执行，如果需要立刻执行 则必须在后面加上立即执行
        // bind会返回一个函数，这个函数就是新的绑定了this的函数
        console.log(print.bind(obj, 22, "前端工程师")); //ƒ print() 
        // 执行bind后的函数
        print.bind(obj, 22, "前端工程师")();
        //{name: "AX"}
        // AX
        // Arguments(2) [22, "前端工程师", callee: ƒ, Symbol(Symbol.iterator): ƒ]

        // 必须注意的是，原函数不会被bind影响，打印结果同正常情况下直接调用print,也就是说
        // 函数执行bind的结果只会绑定在返回的函数上面
        print();
        // window
        // ax
        // Arguments(2) [19, "计算机类", callee: ƒ, Symbol(Symbol.iterator): ƒ]
```
