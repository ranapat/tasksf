import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Parallels extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf parallels');

    const task1 = tf.task(
      1000 * 10,
      (self) => {
        log('task 1 run');
      },
      (self) => {
        log('task 1 complete');
      }
    );
    const task2 = tf.task(
      1000 * 5,
      (self) => {
        log('task 2 run');
      },
      (self) => {
        log('task 2 complete');
      }
    );

    const parallel = tf.parallel(
      () => {
        log('+++ use.tasksf parallels');
        this.complete();
      }
    );

    parallel.push(task1);
    parallel.push(task2);

    parallel.run();
  }
}

export default Parallels;
