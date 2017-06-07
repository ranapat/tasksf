import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Async extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf async');

    const callback = (complete) => {
      log('callback call');
      log('+++ use.tasksf async');
      complete();
    };

    const task = tf.task(
      callback, 0
    );

    log('run task');
    task.run();

  }
}

export default Async;
