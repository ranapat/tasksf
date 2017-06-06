import { tf, Task } from '../../../lib';
import log from '../tools/log';

class TasksSharing extends Task {
  run() {
    this._running = true;

    log();
    log('--- use.tasksf tasks sharing');

    const task1 = tf.task(
      (self) => {
        const chain = self.get(tf._CHAIN_);
        chain.attach('from task 1 run', 'value 1');
        log('task 1 run ' + chain.get('from task 1 run'));
      },
      (self) => {
        const chain = self.get(tf._CHAIN_);
        chain.attach('from task 1 complete', 'value 2');
        log('task 1 complete ' + chain.get('from task 1 run') + ' ' + chain.get('from task 1 complete'));
      }
    );
    const task2 = tf.task(
      (self) => {
        const chain = self.get(tf._CHAIN_);
        chain.attach('from task 2 run', 'value 3');
        log('task 2 run ' + chain.get('from task 1 run') + ' ' + chain.get('from task 1 complete') + ' ' + chain.get('from task 2 run'));
      },
      (self) => {
        const chain = self.get(tf._CHAIN_);
        chain.attach('from task 2 complete', 'value 4');
        log('task 2 complete ' + chain.get('from task 1 run') + ' ' + chain.get('from task 1 complete') + ' ' + chain.get('from task 2 run') + ' ' + chain.get('from task 2 complete'));

        //chain.detach('from task 1 run');
        chain.detach('from task 1 complete');
        //chain.detach('from task 2 run');
        chain.detach('from task 2 complete');
      }
    );

    const sequence = tf.sequence(
      (self) => {
        const chain = self.get(tf._CHAIN_);
        log('taskssharing sequence is complete ' + chain.get('from task 1 run') + ' ' + chain.get('from task 1 complete') + ' ' + chain.get('from task 2 run') + ' ' + chain.get('from task 2 complete'));
        log('+++ use.tasksf tasks sharing');
        this.complete();
      }
    );

    sequence.push(task1).push(task2);

    sequence.run();
  }
}

export default TasksSharing;
