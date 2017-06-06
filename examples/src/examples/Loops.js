import { tf, Task } from '../../../lib';

class Loops extends Task {
  run() {
    this._running = true;

    console.log();
    console.log('--- use.tasksf loops');
    console.log();

    const task1 = tf.task(
      (self) => {
        console.log('task 1 run');
      },
      (self) => {
        console.log('task 1 complete');
      }
    );
    const task2 = tf.task(
      (self) => {
        console.log('task 2 run');
      },
      (self) => {
        console.log('task 2 complete');
      }
    );

    let loops = 0;

    const loop = tf.loop(
      0,
      (self) => {
        console.log('loops loop is looping ... ' + loops);
        if (++loops === 3) {
          console.log('reached 3 loops, enough...');
          self.chain.stop();
          this.complete();
        }
      }
    );

    loop.push(task1).push(task2);

    loop.run();
  }
}

export default Loops;
