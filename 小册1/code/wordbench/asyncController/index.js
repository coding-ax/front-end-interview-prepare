// 异步调度器
class Scheduler {
    maxCount = 0
    tasks = []
    working = []
    constructor(count) {
        this.maxCount = count;
    }
    addTask = (timer, content) => {
        // 控制函数
        const target = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(content);
                    resolve();
                }, 1000 * timer);
            })
        }
        // 入队列
        this.tasks.push(target)
    }
    continueWork = (fn) => {
        // 递归终点（执行完成)
        if (this.tasks.length > 0) {
            // 将后面的拿进来继续执行
            // 先确定下标
            let idx = -1;
            for (let i = 0; i < this.working.length; i++) {
                if (fn === this.working[i]) {
                    // 将其替换并执行
                    idx = i;
                    break;
                }
            }
            // 调用并运行
            const next = this.tasks.shift();
            next().then(() => {
                this.continueWork(next)
            })
            this.working[idx] = next;
        }
    }
    start = () => {
        let len = this.tasks.length;
        if (len >= this.maxCount) {
            // 否则就将其加入工作队列并执行
            this.working = this.tasks.splice(0, this.maxCount);
            console.log(this.working.length)
            this.working.map(fn => {
                fn().then(() => {
                    // 完成后再回调
                    // 当前执行完毕
                    this.continueWork(fn);
                })
            })
        } else {
            //小于调度范围： 直接全部执行
            this.tasks.map(fn => fn())
        }
    }
}

const scheduler = new Scheduler(2)
scheduler.addTask(1, '1');   // 1s后输出’1'
scheduler.addTask(2, '2');  // 2s后输出’2'
scheduler.addTask(1, '3');  // 2s后输出’3'
scheduler.addTask(1, '4');  // 3s后输出’4'
scheduler.addTask(1, '5');  // 3s后输出’5'
scheduler.addTask(1, '6'); // 4s后输出'6'
scheduler.start();