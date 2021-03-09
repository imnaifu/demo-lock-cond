/**
 * 全局常量定义
 */

// 输出的累加值
const totalLocation = 0; // 0 - 3 是 int32 total 数据位置

// 已执行完的 worker 数量
const countLocation = 4; // 4 - 7 是 int32 count 数据位置

// lock 的起始位置
const lockLocation = 8; // 8 - 11 是 int32 lock 位置

// cond 的起始位置
const condLocation = 12; // 12 - 16 是 int32 cond 位置

// 循环次数
const loopTime = 100000;

// worker 数量
const numberOfWorkers = 4;
