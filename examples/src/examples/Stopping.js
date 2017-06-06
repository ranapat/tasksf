import { tf, Task } from '../../../lib';

class Stopping extends Task {
  run() {
    this._running = true;

    console.log();
    console.log('--- use.tasksf stopping');
    console.log();

    let counter = 0;

    const task1 = tf.task(
      (self) => {
        console.log('task 1 run ' + counter);
        if (counter == 0) {
          console.log('task 1 stopping sequence');
          self.chain.stop();
        } else if (counter == 1) {
          console.log('task 2 stopping sequence and removing itself');
          self.chain.stop(true);
        }
      },
      (self) => {
        ++counter;

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

    const sequence = tf.sequence(
      () => {
        console.log('stopping sequence is complete');

        if (counter === 2) {
          this.complete();
        }
      }
    );

    sequence.push(task1);
    sequence.push(task2);

    console.log('starting sequence run (1)');
    sequence.run();
    console.log('starting sequence run (2)');
    sequence.run();
    console.log('starting sequence run (3)');
    sequence.run();
  }
}

export default Stopping;
