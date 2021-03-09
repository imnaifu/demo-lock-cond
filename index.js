console.log("index.js loaded");

// define 16 bytes 共享内存
// 共 16 * 8 = 128 个 bit
const sab = new SharedArrayBuffer(16);

// 在共享内存的指定位置初始化 lock & cond
Lock.initialize(sab, lockLocation);
Cond.initialize(sab, condLocation);

// 创建多个 worker 线程
for (let i = 1; i <= numberOfWorkers; i++) {
  const worker = new Worker("worker.js");
  // 将共享内存的内存地址传给 worker
  worker.postMessage([sab, i]);
}

// 当 worker 都执行完的时候输出结果
const condWorker = new Worker("cond.js");

// 将共享内存的内存地址传给 cond
condWorker.postMessage(sab);
condWorker.onmessage = (event) => {
  const expectData = loopTime * numberOfWorkers;
  console.log("final data", event.data);
  console.log("expect data", expectData);
};
