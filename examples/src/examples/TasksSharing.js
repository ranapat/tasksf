import { tf, Task } from '../../../lib';

class TasksSharing extends Task {
  run() {
    this._running = true;

    console.log();
    console.log('--- use.tasksf tasks sharing');
    console.log();

    const task1 = tf.task(
      (self) => {
        const chain = self.get(tf._CHAIN_);
        chain.attach('from task 1 run', 'value 1');
        console.log('task 1 run ' + chain.get('from task 1 run'));
      },
      (self) => {
        const chain = self.get(tf._CHAIN_);
        chain.attach('from task 1 complete', 'value 2');
        console.log('task 1 complete ' + chain.get('from task 1 run') + ' ' + chain.get('from task 1 complete'));
      }
    );
    const task2 = tf.task(
      (self) => {
        const chain = self.get(tf._CHAIN_);
        chain.attach('from task 2 run', 'value 3');
        console.log('task 2 run ' + chain.get('from task 1 run') + ' ' + chain.get('from task 1 complete') + ' ' + chain.get('from task 2 run'));
      },
      (self) => {
        const chain = self.get(tf._CHAIN_);
        chain.attach('from task 2 complete', 'value 4');
        console.log('task 2 complete ' + chain.get('from task 1 run') + ' ' + chain.get('from task 1 complete') + ' ' + chain.get('from task 2 run') + ' ' + chain.get('from task 2 complete'));

        //chain.detach('from task 1 run');
        chain.detach('from task 1 complete');
        //chain.detach('from task 2 run');
        chain.detach('from task 2 complete');
      }
    );

    const sequence = tf.sequence(
      (self) => {
        const chain = self.get(tf._CHAIN_);
        console.log('taskssharing sequence is complete ' + chain.get('from task 1 run') + ' ' + chain.get('from task 1 complete') + ' ' + chain.get('from task 2 run') + ' ' + chain.get('from task 2 complete'));
        this.complete();
      }
    );

    sequence.push(task1).push(task2);

    sequence.run();
  }
}

export default TasksSharing;
