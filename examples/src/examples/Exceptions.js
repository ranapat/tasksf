import { tf, Task } from '../../../lib';

class Exceptions extends Task {
  run() {
    this._running = true;

    console.log();
    console.log('--- use.tasksf exceptions');
    console.log();

    const task1 = tf.task(
      () => {
        console.log('task 1 run');
      },
      () => {
        console.log('task 1 complete');
        throw new Error('error 1');
      }
    );
    const task2 = tf.task(
      (self, recover) => {
        console.log('task 2 run ' + recover);
      },
      () => {
        console.log('task 2 complete');
      },
      (self, error) => {
        console.log('task 2 recover ' + error.message);

        // task can recover or not depending on return
        // will recover if returns anything but undefined
        //return 'recovered';
        return undefined;
      }
    );

    const sequence = tf.sequence(
      () => {
        console.log('sequence is complete');
        this.complete();
      },
      (self, error) => {
        console.log('exceptions sequence recover ' + error.message);
        this.complete();
      }
    );

    sequence.push(task1);
    sequence.push(task2);

    sequence.run();
  }
}

export default Exceptions;
