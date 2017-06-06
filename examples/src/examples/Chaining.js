import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Chaining extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf chaining');

    const task1 = tf.task(
      () => {
        log('task 1 run');
      },
      () => {
        log('task 1 complete');
      }
    );

    const sequence = tf.sequence(
      () => {
        log('+++ use.tasksf chaining');
        this.complete();
      }
    ).push(task1).run();
  }
}

export default Chaining;
