// 编写快速排序
/**
 *
 * 10行代码实现快排
 * @param {number[]} arr
 * @return {number[]} 
 */
const quickSort = (arr) => {
    // 定义递归条件：当数组长度小于等于1 直接返回
    if (arr.length <= 1) return arr;
    // 定义左右数组 存放分割后的值
    const left = [];
    const right = [];
    // 取中点为基准值，并且将中点从数组中抽离
    const midPoint = Math.floor(arr.length / 2)
    const middle = arr.splice(midPoint, 1)[0];
    // 以中点作为基准，比中点大的放到right数组 否则放到left数组
    for (let i = 0; i < arr.length; i++) {
        arr[i] > middle ? right.push(arr[i]) : left.push(arr[i]);
    }
    // 递归调用并且将其拼接
    return quickSort(left).concat([middle], quickSort(right))
}
// 测试
let userCase = [1, 4, 2, 5, 1, 5,24,43,0,-23,1];
console.log(quickSort(userCase));