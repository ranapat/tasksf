import { tf, Task, Map, Match } from '../../../lib';
import log from '../tools/log';

class Remap extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf remap');

    const task = tf.task(
      () => {
        log('task 1 run');
      },
      (self) => {
        log('task 1 complete');
      }
    );

    // default is 0.5
    // to overwrite match - set higher priority
    // to keep the previous - set lower
    const match1 = new Match(task, 0.90);
    const match2 = new Match(task, 0.40);

    const map1 = new class extends Map {
      match(...args) {
        return match1;
      }
    };
    const map2 = new class extends Map {
      match(...args) {
        return match2;
      }
    };

    const task1 = tf.task();
    log('task1 is different from task ' + (task !== task1));

    tf.map(map2);
    const task3 = tf.task();
    log('task3 is different from task ' + (task === task3));

    tf.map(map1);
    const task2 = tf.task();
    log('task2 is the same as task ' + (task === task2));

    tf.unmapAll();
    tf.initialize(true);

    log('+++ use.tasksf remap');

    this.complete();
  }
}

export default Remap;
