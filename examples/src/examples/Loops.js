import { tf, Task } from '../../../lib';
import log from '../tools/log';

class Loops extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf loops');

    const task1 = tf.task(
      (self) => {
        log('task 1 run');
      },
      (self) => {
        log('task 1 complete');
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

    let loops = 0;

    const loop = tf.loop(
      0,
      (self) => {
        log('loops loop is looping ... ' + loops);
        if (++loops === 3) {
          log('reached 3 loops, enough...');
          self.chain.stop();
          log('+++ use.tasksf loops');
          this.complete();
        }
      }
    );

    loop.push(task1).push(task2);

    loop.run();
  }
}

export default Loops;
