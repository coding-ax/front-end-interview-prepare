## Promise基本用法



## Promise凭什么解决了“回调地狱”

主要有三个原因：

1. then链式调用，实现回调函数**延迟绑定**

   通过then的链式调用，我们可以在定义了要同步执行的代码后再通过then执行其定义的回调函数。

   比如：

   

2. **返回值穿透**

   通过promise中then的调用，可以将其返回值作为一个新的promise，在之后的then中调用其上一个then的返回值，比如我们常用的fetch：

   ```js
   fetch('http://example.com/api').then(res=>res.json()).then(jsonRes=>{console.log(jsonRes)})
   ```

   在上面的逻辑中，我们在第一个then里返回response响应的json格式的数据，以供下一个then调用，第二个then中的jsonRes已经是第一个res.json()的结果了。

3. **错误冒泡**处理

   在以往的回调函数中，我们往往需要同时定义success和error两种情况，而对于多个调用，这样会让开发变得非常的麻烦，要编写很多的错误处理，而在promise中，所有的错误都会冒泡到catch之中，我们可以在只编写一个回调事件用于处理出错的catch事件。

## Promise的then为什么是一个微任务

在JavaScript回调函数的调用有三种方式：

> 1. 同步调用，在回调函数拿到结果前不执行任何其他代码。
> 2. 异步调用，作为宏任务插入到宏任务队列的队尾，在宏任务队列中按次序执行。
> 3. 异步调用，作为微任务插入到当前宏任务的微任务队列中，即在执行当前宏任务的最后执行微任务队列。

显然，如果把promise的then作为第一种方式，将会**导致cpu资源的浪费**，**出现**同步的**阻塞问题**，这是很浪费计算机宝贵资源的（实际上就是同步异步本身的性能差异），与此同时还会有一个问题，那就是将其定义成同步任务，**无法实现延迟绑定回调函数**的效果

延迟绑定：也就是在定义好要执行的同步函数之后，再从then中传入回调函数。

而异步调用，若是作为宏任务，**如果宏任务队列很长**，要执行的代码很多，就**会出现严重的延迟**，而对于大部分的场景，我们都是希望能尽早完成回调函数的调用的。

所以Promise的then自然而然地成为了一个微任务，既使用了异步回调**保证效率**，也**保证**了回调函数调用的**实时性**。

## Promise手写
```js
// 编写promise
// 测试方法：
// npx promises-aplus-tests promise.js
class MyPromise {
    // 状态定义
    PENDING = 'pending'
    FULFILLED = 'fulfilled'
    REJECTED = 'rejected'
    // 保存失败的值
    result = undefined;
    // 保存成功的值
    value = undefined;
    // 保存成功回调
    onResolveArr = [];
    // 保存失败回调
    onRejectArr = [];
    // 状态
    status = this.PENDING
    constructor(executor) {
        // 确保状态正确
        if (this.status === this.PENDING) {
            // 构造就去调用executor
            try {
                executor(this.resolve, this.reject);
            } catch (error) {
                // 出现异常直接调用error
                this.reject(error)
            }
        }
    }
    // 一定要用箭头函数 因为只有此时的箭头函数中this指向这个class
    resolve = (value) => {
        // 一个promise状态只能改变一次
        if (this.status === this.PENDING) {
            // 修改状态
            this.status = this.FULFILLED;
            this.value = value;
            // 执行成功的回调函数
            this.onResolveArr.forEach(resolveFn => (resolveFn(this.value)))
        }
    }
    reject = (result) => {
        if (this.status === this.PENDING) {
            this.status = this.REJECTED;
            this.result = result;
            // 执行失败的回调函数
            this.onRejectArr.forEach(rejectFn => (rejectFn(this.result)))
        }
    }
    // 做到能链式调用
    then(resolveCallBack, rejectCallBack) {
        // 确保传入为函数
        typeof resolveCallBack === 'function' ? null : resolveCallBack = value => value;
        typeof rejectCallBack === 'function' ? null : rejectCallBack = result => {
            throw TypeError(result instanceof Error ? result.message : result)
        }
        // 返回一个新的promise对象
        return new MyPromise((resolveFn, rejectFn) => {
            // 需要注意 由于此处使用的是箭头函数 this指向的是前文的promise
            // 另外 此处的函数不是立刻执行的
            this.onResolveArr.push(() => {
                try {
                    // 执行此时的then函数
                    let res = resolveCallBack(this.value)
                    // 判断res是不是一个promise
                    res instanceof MyPromise ? res.then(resolveFn, rejectFn) : resolveFn(res)
                } catch (error) {
                    rejectFn(error)
                }
            })
            this.onRejectArr.push(() => {
                try {
                    // 执行此时的then函数
                    let res = rejectCallBack(this.result)
                    // 判断res是不是一个promise
                    res instanceof MyPromise ? res.then(resolveFn, rejectFn) : resolveFn(res)
                } catch (error) {
                    rejectFn(error)
                }
            })
        })
    }
    catch(reject) {
        this.then(null, reject)
    }
}


// 测试
new MyPromise((resolve, reject) => {
    setTimeout(() => {
        Math.random() * 100 > 50 ? resolve("ok") : reject("no")
    }, 1000);
}).then(res => {
    console.log(res)
    return "next"
}).then(res => {
    console.log(res)
}).catch(res => {
    console.log(res)
})

```