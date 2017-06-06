import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Self extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf self');

    const task1 = tf.task(
      (self) => {
        log('task 1 run ' + self + ' ' + (self !== this));
      },
      (self) => {
        log('task 1 complete ' + self + ' ' + (self !== this));
      }
    );

    const sequence = tf.sequence(
      () => {
        log('+++ use.tasksf self');
        this.complete();
      }
    );

    sequence.push(task1);

    sequence.run();
  }
}

export default Self;
