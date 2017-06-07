import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Async extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf async');

    const runCallback = (complete) => {
      log('run call');
      complete();
    };

    const completeCallback = () => {
      log('complete call');
      log('+++ use.tasksf async');
      this.complete();
    };

    const task = tf.task(
      runCallback, completeCallback, 0
    );

    log('run task');
    task.run();

  }
}

export default Async;
