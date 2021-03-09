console.log("cond.js loaded");

importScripts("./lock.js", "./const.js");

onmessage = function (ev) {
  let sab = ev.data;

  const lock = new Lock(sab, lockLocation);
  const cond = new Cond(lock, condLocation);

  const count = new Int32Array(sab, countLocation, 1);
  const total = new Int32Array(sab, totalLocation, 1);

  // cond.wait 调用前一定要现 acquire lock
  // 同样也是防止 race condition
  lock.lock();
  while (count[0] < numberOfWorkers) {
    // 确保所有 worker 都执行完
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait

    // 休眠前释放锁 lock.unlock()
    cond.wait(); // 等待 cond 通知
    // 休眠后 reacquire 锁 lock.lock()
  }
  // 完成后释放锁
  lock.unlock();

  postMessage(total[0]);
};

// The responsibility of wait() is to release the lock and put the calling thread to sleep (automatically)
// When the thead wakes up (after some other thead has signaled it), it must reacquire the lock before returning to the caller
