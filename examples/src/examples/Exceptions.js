import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Exceptions extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf exceptions');

    const task1 = tf.task(
      () => {
        log('task 1 run');
      },
      () => {
        log('task 1 complete');
        throw new Error('error 1');
      }
    );
    const task2 = tf.task(
      (self, recover) => {
        log('task 2 run ' + recover);
      },
      () => {
        log('task 2 complete');
      },
      (self, error) => {
        log('task 2 recover ' + error.message);

        // task can recover or not depending on return
        // will recover if returns anything but undefined
        //return 'recovered';
        return undefined;
      }
    );

    const sequence = tf.sequence(
      () => {
        log('+++ use.tasksf exceptions');
        this.complete();
      },
      (self, error) => {
        log('+++ exceptions sequence recover ' + error.message);
        this.complete();
      }
    );

    sequence.push(task1);
    sequence.push(task2);

    sequence.run();
  }
}

export default Exceptions;
