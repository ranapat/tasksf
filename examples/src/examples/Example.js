import { tf, Task } from '../../../lib';

class Example extends Task {
  run() {
    this._running = true;

    console.log();
    console.log('--- use.tasksf example');
    console.log();

    const task1 = tf.task(
      () => console.log('task 1 run')
    );
    const task2 = tf.task(
      () => console.log('task 2 run')
    );

    tf.sequence().push(task1).push(task2).run();

    this.complete();
  }
}

export default Example;
