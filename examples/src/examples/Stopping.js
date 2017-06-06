import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Stopping extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf stopping');

    let counter = 0;

    const task1 = tf.task(
      (self) => {
        log('task 1 run ' + counter);
        if (counter == 0) {
          log('task 1 stopping sequence');
          self.chain.stop();
          log('task 1 is stopped');
        } else if (counter == 1) {
          log('task 2 stopping sequence and removing itself');
          self.chain.stop(true);
        }
      },
      (self) => {
        ++counter;

        log('task 1 complete with counter ' + counter);
      }
    );
    const task2 = tf.task(
      (self) => {
        log('task 2 run');
      },
      (self) => {
        log('task 2 complete');
      }
    );

    const sequence = tf.sequence(
      () => {
        log('stopping sequence is complete');

        if (counter === 2) {
          ++counter;
        } else if (counter === 3) {
          log('+++ use.tasksf stopping');
          this.complete();
        }
      }
    );

    sequence.push(task1);
    sequence.push(task2);

    log('starting sequence run (1)');
    sequence.run();
    log('starting sequence run (2)');
    sequence.run();
    log('starting sequence run (3)');
    sequence.run();
  }
}

export default Stopping;
