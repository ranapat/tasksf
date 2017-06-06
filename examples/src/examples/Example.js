import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Example extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf example');

    const task1 = tf.task(
      () => log('task 1 run')
    );
    const task2 = tf.task(
      () => log('task 2 run')
    );

    tf.sequence().push(task1).push(task2).run();

    log('+++ use.tasksf example');

    this.complete();
  }
}

export default Example;
