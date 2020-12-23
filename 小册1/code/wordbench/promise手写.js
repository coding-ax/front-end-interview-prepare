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
