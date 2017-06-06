import { tf, Task } from '../../../lib';

class Parallels extends Task {
  run() {
    this._running = true;

    console.log();
    console.log('--- use.tasksf parallels');
    console.log();

    const task1 = tf.task(
      1000 * 10,
      (self) => {
        console.log('task 1 run');
      },
      (self) => {
        console.log('task 1 complete');
      }
    );
    const task2 = tf.task(
      1000 * 5,
      (self) => {
        console.log('task 2 run');
      },
      (self) => {
        console.log('task 2 complete');
      }
    );

    const parallel = tf.parallel(
      () => {
        console.log('parallels sequence is complete');
        this.complete();
      }
    );

    parallel.push(task1);
    parallel.push(task2);

    parallel.run();
  }
}

export default Parallels;
