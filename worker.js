importScripts("./lock.js", "./const.js");

console.log("worker.js loaded");

// worker global scope
// https://developer.mozilla.org/zh-CN/docs/Web/API/WorkerGlobalScope
onmessage = (event) => {
  const {
    data: [sab, workerId],
  } = event;

  console.log("message received for worker " + workerId);

  // 在共享内存的指定位置创建锁的 agent
  // 这里 Lock.NUMBYTES = 4;
  // 即锁本身需要 4 byte
  const lock = new Lock(sab, lockLocation);
  const cond = new Cond(lock, condLocation);

  // 在共享内存的 location 位置创建 32 位整型 View
  // 即使用 4 个 byte, 32 个 bit
  const total = new Int32Array(sab, totalLocation, 1); // 所有 worker 执行完的结果
  const count = new Int32Array(sab, countLocation, 1); // 多少个 worker 已执行完成

  // 对共享内存的值做运算
  for (let i = 1; i <= loopTime; i++) {
    lock.lock();
    total[0] += 1; // 临界区域 (critical section) 指的是一块对公共资源进行访问的代码
    lock.unlock();
  }

  lock.lock();
  count[0]++; // 当前 worker 执行结束，计数加一
  cond.notifyOne(); // 通知正在等待的 cond
  lock.unlock();

  console.log("view data from worker " + workerId, total[0]);
};
