import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Simple extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf simple');

    const task1 = tf.task(
      () => {
        log('simple task 1 run');
      },
      () => {
        log('simple task 1 complete');
      }
    );
    const task2 = tf.task(
      5 * 1000,
      () => { log('simple task 2 run'); },
      () => { log('simple task 2 complete'); clearInterval(interval); }
    );
    const task3 = tf.task(
      () => { log('simple task 3 complete'); },
      false
    );

    const sequence = tf.sequence(
      () => {
        log('+++ use.tasksf simple');
        this.complete();

      }
    );

    sequence.push(task1);
    sequence.push(task2);
    sequence.unshift(task3);

    sequence.run();

    setTimeout(
      () => {
        task3.complete();
      },
      1 * 1000
    );
    let counter = 0;
    const interval = setInterval(
      () => {
        ++counter;
        process.stdout.write('.' + counter);
      },
      1 * 1000
    );
  }
}

export default Simple;
