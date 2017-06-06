import { tf, Task, Map, Match } from '../../../lib';

class Remap extends Task {
  run() {
    this._running = true;

    console.log();
    console.log('--- use.tasksf remap');
    console.log();

    const task = tf.task(
      () => {
        console.log('task 1 run');
      },
      (self) => {
        console.log('task 1 complete');
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
    console.log('task1 is different from task ' + (task !== task1));

    tf.map(map2);
    const task3 = tf.task();
    console.log('task3 is different from task ' + (task === task3));

    tf.map(map1);
    const task2 = tf.task();
    console.log('task2 is the same as task ' + (task === task2));

    tf.unmapAll();
    tf.initialize(true);

    this.complete();
  }
}

export default Remap;
