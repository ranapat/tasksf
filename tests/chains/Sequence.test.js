import chai from 'chai';
import chai_spies from 'chai-spies';
import { expect } from 'chai';
import { Task, TimeoutTask, TriggerTask } from '../../src';
import { Sequence } from '../../src';

describe('Test Sequence', () => {
  chai.use(chai_spies);

  it('to not be running by default', () => {
    const sequence = new Sequence();
    expect(sequence.running).to.equal(false);
  });

  it('to not be running after complete', () => {
    const sequence = new Sequence();
    sequence.run();
    expect(sequence.running).to.equal(false);
  });

  it('to have complete run at the end', () => {
    const complete = chai.spy((self) => {});
    const sequence = new Sequence(complete);
    sequence.run();
    expect(complete).to.have.been.called();
  });

  it('to not have complete run without run', () => {
    const complete = chai.spy((self) => {});
    const sequence = new Sequence(complete);
    expect(complete).not.to.have.been.called();
    sequence.run();
    expect(complete).to.have.been.called();
  });

  it('to push and unshift tasks', () => {
    const sequence = new Sequence();
    expect(sequence.tasks.length).to.equal(0);
    sequence.push(new Task());
    expect(sequence.tasks.length).to.equal(1);
    sequence.unshift(new Task());
    expect(sequence.tasks.length).to.equal(2);
    const taskA = new Task();
    sequence.push(taskA);
    expect(sequence.tasks.length).to.equal(3);
    expect(sequence.tasks[2]).to.equal(taskA);
    const taskB = new Task();
    sequence.unshift(taskB);
    expect(sequence.tasks.length).to.equal(4);
    expect(sequence.tasks[3]).to.equal(taskA);
    expect(sequence.tasks[0]).to.equal(taskB);
  });

  it('to remove tasks', () => {
    const sequence = new Sequence();
    const taskA = new Task();
    sequence.push(taskA);
    expect(sequence.tasks.length).to.equal(1);
    expect(sequence.tasks[0]).to.equal(taskA);
    sequence.remove(new Task());
    expect(sequence.tasks.length).to.equal(1);
    expect(sequence.tasks[0]).to.equal(taskA);
    sequence.remove(taskA);
    expect(sequence.tasks.length).to.equal(0);
  });

  it('to change the completes during run', () => {
    const taskComplete = chai.spy((self) => {});
    const sequence = new Sequence();
    const taskA = new TriggerTask(taskComplete);
    expect(taskA._complete).to.equal(taskComplete);
    expect(taskA.__injected__sequenceAfterComplete).to.equal(undefined);
    sequence.push(taskA);
    sequence.run();
    expect(taskA.__injected__sequenceAfterComplete).to.equal(taskComplete);
    expect(taskA._complete).not.to.equal(taskComplete);
    taskA.complete();
    expect(taskA._complete).to.equal(taskComplete);
    expect(taskA.__injected__sequenceAfterComplete).to.equal(undefined);
  });

  it('to run and complete 1', () => {
    const sequenceComplete = chai.spy((self) => {});
    const taskRun = chai.spy((self) => {});
    const taskComplete = chai.spy((self) => {});
    const sequence = new Sequence(sequenceComplete);
    const task = new Task(taskRun, taskComplete);
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun).not.to.have.been.called();
    expect(taskComplete).not.to.have.been.called();
    sequence.push(task);
    sequence.run();
    expect(sequenceComplete).to.have.been.called();
    expect(taskRun).to.have.been.called();
    expect(taskComplete).to.have.been.called();
  });

  it('to run and complete 2', () => {
    const sequenceComplete = chai.spy((self) => {});
    const taskRun1 = chai.spy((self) => {});
    const taskComplete1 = chai.spy((self) => {});
    const taskRun2 = chai.spy((self) => {});
    const taskComplete2 = chai.spy((self) => {});
    const sequence = new Sequence(sequenceComplete);
    const task1 = new Task(taskRun1, taskComplete1);
    const task2 = new Task(taskRun2, taskComplete2);
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    expect(taskRun2).not.to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    sequence.push(task1);
    sequence.push(task2);
    sequence.run();
    expect(sequenceComplete).to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
    expect(taskRun2).to.have.been.called();
    expect(taskComplete2).to.have.been.called();
  });

  it('to run and complete 3', () => {
    const sequenceComplete = chai.spy((self) => {});
    const taskRun1 = chai.spy((self) => {});
    const taskComplete1 = chai.spy((self) => {});
    const taskComplete2 = chai.spy((self) => {});
    const sequence = new Sequence(sequenceComplete);
    const task1 = new Task(taskRun1, taskComplete1);
    const task2 = new TriggerTask(taskComplete2);
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    sequence.push(task1);
    sequence.push(task2);
    sequence.run();
    expect(sequence.running).to.equal(true);
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    task2.complete();
    expect(sequenceComplete).to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
    expect(taskComplete2).to.have.been.called();
    expect(sequence.running).to.equal(false);
  });

  it('to run and complete 4', (done) => {
    const sequenceComplete = chai.spy((self) => {});
    const taskRun1 = chai.spy((self) => {});
    const taskComplete1 = chai.spy((self) => {});
    const taskComplete2 = chai.spy((self) => {});
    const taskRun3 = chai.spy((self) => {});
    const taskComplete3 = chai.spy((self) => {});
    const sequence = new Sequence(sequenceComplete);
    const task1 = new Task(taskRun1, taskComplete1);
    const task2 = new TriggerTask(taskComplete2);
    const task3 = new TimeoutTask(1, taskRun3, taskComplete3);
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    expect(taskRun3).not.to.have.been.called();
    expect(taskComplete3).not.to.have.been.called();
    sequence.push(task1);
    sequence.push(task2);
    sequence.push(task3);
    sequence.run();
    expect(sequence.running).to.equal(true);
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    expect(taskRun3).not.to.have.been.called();
    expect(taskComplete3).not.to.have.been.called();
    task2.complete();
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
    expect(taskComplete2).to.have.been.called();
    expect(taskRun3).not.to.have.been.called();
    expect(taskComplete3).not.to.have.been.called();
    expect(sequence.running).to.equal(true);
    setTimeout(() => {
      expect(sequenceComplete).to.have.been.called();
      expect(taskRun1).to.have.been.called();
      expect(taskComplete1).to.have.been.called();
      expect(taskComplete2).to.have.been.called();
      expect(taskRun3).to.have.been.called();
      expect(taskComplete3).to.have.been.called();
      expect(sequence.running).to.equal(false);
      done();
    }, 1);
  });

  it('to run and resolve exceptions 1', () => {
    const sequenceComplete = chai.spy((self) => {});
    const taskRun1 = chai.spy((self) => {
      throw new Error('error 1');
    });
    const taskComplete1 = chai.spy((self, error) => {
      throw new Error('error 2');
    });
    const taskRun2 = chai.spy((self, ...args) => {
      throw new Error('error 3');
    });
    const taskComplete2 = chai.spy((self) => {
      throw new Error('error 4');
    });
    const taskRecover2 = chai.spy((self, error) => {
      return true;
    });
    const sequence = new Sequence(sequenceComplete);
    const task1 = new Task(taskRun1, taskComplete1);
    const task2 = new Task(taskRun2, taskComplete2, taskRecover2);
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    expect(taskRun2).not.to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    sequence.push(task1);
    sequence.push(task2);
    sequence.run();
    expect(sequenceComplete).to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
    expect(taskRun2).to.have.been.called();
    expect(taskComplete2).to.have.been.called();
  });

  it('to run and resolve exceptions 2', () => {
    const sequenceComplete = chai.spy((self) => {});
    const sequenceRecover = chai.spy((self, error) => {});
    const taskRun1 = chai.spy((self) => {
      throw new Error('error 1');
    });
    const taskComplete1 = chai.spy((self, error) => {
      throw new Error('error 2');
    });
    const taskRun2 = chai.spy((self, ...args) => {
      throw new Error('error 3');
    });
    const taskComplete2 = chai.spy((self) => {
      throw new Error('error 4');
    });
    const taskRecover2 = chai.spy((self, error) => {
      return undefined;
    });
    const sequence = new Sequence(sequenceComplete, sequenceRecover);
    const task1 = new Task(taskRun1, taskComplete1);
    const task2 = new Task(taskRun2, taskComplete2, taskRecover2);
    expect(sequenceComplete).not.to.have.been.called();
    expect(sequenceRecover).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    expect(taskRun2).not.to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    sequence.push(task1);
    sequence.push(task2);
    sequence.run();
    expect(sequenceComplete).not.to.have.been.called();
    expect(sequenceRecover).to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
    expect(taskRun2).not.to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
  });

  it('to run and complete trigger tasks with callback', () => {
    const sequenceComplete = chai.spy((self) => {});
    const taskRun1 = chai.spy((self) => {});
    const taskComplete1 = chai.spy((self) => {});
    const taskComplete2 = chai.spy((self) => {});
    const sequence = new Sequence(sequenceComplete);
    const task1 = new Task(taskRun1, taskComplete1);
    const task2 = new TriggerTask(taskComplete2);
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    sequence.push(task1);
    sequence.unshift(task2);
    sequence.run();
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    task2.complete();
    expect(sequenceComplete).to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
    expect(taskComplete2).to.have.been.called();
  });

  it('to run and complete trigger tasks without callback', () => {
    const sequenceComplete = chai.spy((self) => {});
    const taskRun1 = chai.spy((self) => {});
    const taskComplete1 = chai.spy((self) => {});
    const sequence = new Sequence(sequenceComplete);
    const task1 = new Task(taskRun1, taskComplete1);
    const task2 = new TriggerTask();
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    sequence.push(task1);
    sequence.unshift(task2);
    sequence.run();
    expect(sequenceComplete).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    task2.complete();
    expect(sequenceComplete).to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
  });

  it('to handle current task', () => {
    const sequence = new Sequence();
    expect(sequence.current).to.equal(undefined);
    sequence.run();
    expect(sequence.current).to.equal(undefined);

    const task = new TriggerTask();
    sequence.push(task);
    expect(sequence.current).to.equal(undefined);
    sequence.run();
    expect(sequence.current).to.equal(task);
    task.complete();
    expect(sequence.current).to.equal(undefined);
  });

  it('to not be able to stop sequence with no current or following tasks', () => {
    const sequence = new Sequence();
    sequence.run();
    expect(sequence.stop()).to.equal(false);
  });

  it('to be able to stop sequence with current or following tasks 1', () => {
    const sequence = new Sequence();
    const task = new TimeoutTask(1);
    sequence.push(task);
    sequence.run();
    expect(sequence.stop()).to.equal(true);
    expect(sequence.current).to.equal(task);
    expect(sequence.tasks.length).to.equal(1);
  });

  it('to be able to stop sequence with current or following tasks 2', (done) => {
    const sequence = new Sequence();
    const task = new TimeoutTask(1);
    sequence.push(task);
    sequence.run();
    expect(sequence.stop()).to.equal(true);
    expect(sequence.current).to.equal(task);
    expect(sequence.tasks.length).to.equal(1);
    setTimeout(() => {
      expect(sequence.stop()).to.equal(true);
      expect(sequence.current).to.equal(task);
      expect(sequence.tasks.length).to.equal(1);
      done();
    }, 1);
  });

  it('to be able to stop sequence with current or following tasks 3', (done) => {
    const sequence = new Sequence();
    const task = new TimeoutTask(1);
    sequence.push(task);
    sequence.run();
    setTimeout(() => {
      expect(sequence.stop()).to.equal(false);
      expect(sequence.current).to.equal(undefined);
      expect(sequence.tasks.length).to.equal(0);
      done();
    }, 1);
  });

  it('to be able to stop on a task and if tasks is rerun the sequence shall not go on', (done) => {
    const run = chai.spy((self) => {});
    const complete = chai.spy((self) => {});
    const sequence = new Sequence(complete);
    const task = new TimeoutTask(1, run);
    sequence.push(task);
    sequence.run();
    expect(run).not.to.have.been.called();
    expect(complete).not.to.have.been.called();
    expect(sequence.stop()).to.equal(true);
    expect(run).not.to.have.been.called();
    expect(complete).not.to.have.been.called();
    task.run();
    setTimeout(() => {
      expect(run).to.have.been.called();
      expect(complete).not.to.have.been.called();
      done();
    }, 0);
  });

  it('to be able to stop and run again and restart the current', (done) => {
    const run = chai.spy((self) => {});
    const complete = chai.spy((self) => {});
    const sequence = new Sequence(complete);
    const task = new TimeoutTask(1, run);
    sequence.push(task);
    expect(sequence.tasks.length).to.equal(1);
    sequence.run();
    expect(sequence.tasks.length).to.equal(0);
    expect(sequence.current).to.equal(task);
    sequence.stop();
    expect(run).not.to.have.been.called();
    expect(complete).not.to.have.been.called();
    expect(sequence.tasks.length).to.equal(1);
    expect(sequence.current).to.equal(task);
    sequence.run();
    expect(run).not.to.have.been.called();
    expect(complete).not.to.have.been.called();
    expect(sequence.tasks.length).to.equal(0);
    expect(sequence.current).to.equal(task);
    setTimeout(() => {
      expect(run).to.have.been.called();
      expect(complete).to.have.been.called();
      expect(sequence.tasks.length).to.equal(0);
      expect(sequence.current).to.equal(undefined);
      done();
    }, 1);
  });

  it('to be able to stop and skip', () => {
    const sequence = new Sequence();
    const task = new TimeoutTask(1);
    sequence.push(task);
    sequence.run();
    expect(sequence.stop()).to.equal(true);
    expect(sequence.current).to.equal(task);
    expect(sequence.tasks.length).to.equal(1);
    sequence.run();
    expect(sequence.stop(true)).to.equal(true);
    expect(sequence.current).to.equal(undefined);
    expect(sequence.tasks.length).to.equal(0);
  });

  it('to populate current and passed (1)', () => {
    const sequence = new Sequence();
    const task = new TriggerTask();
    sequence.push(task);
    expect(sequence.current).to.equal(undefined);
    expect(sequence.passed.length).to.equal(0);
    sequence.run();
    expect(sequence.current).to.equal(task);
    expect(sequence.passed.length).to.equal(0);
    task.complete();
    expect(sequence.current).to.equal(undefined);
    expect(sequence.passed.length).to.equal(1);
    expect(sequence.passed[0]).to.equal(task);
  });

  it('to populate current and passed (2)', () => {
    const sequence = new Sequence();
    const task1 = new TriggerTask();
    const task2 = new Task();
    sequence.push(task1).push(task2);
    expect(sequence.current).to.equal(undefined);
    expect(sequence.passed.length).to.equal(0);
    sequence.run();
    expect(sequence.current).to.equal(task1);
    expect(sequence.passed.length).to.equal(0);
    task1.complete();
    expect(sequence.current).to.equal(undefined);
    expect(sequence.passed.length).to.equal(2);
    expect(sequence.passed[0]).to.equal(task1);
    expect(sequence.passed[1]).to.equal(task2);
  });

  it('to reset (1)', () => {
    const sequence = new Sequence();
    const task1 = new TriggerTask();
    const task2 = new Task();
    sequence.push(task1).push(task2);
    expect(sequence.current).to.equal(undefined);
    expect(sequence.passed.length).to.equal(0);
    sequence.run();
    expect(sequence.reset()).to.equal(false);
    task1.complete();
    expect(sequence.reset()).to.equal(true);
  });

  it('to reset (2)', () => {
    const sequence = new Sequence();
    const task1 = new TriggerTask();
    const task2 = new Task();
    sequence.push(task1).push(task2);
    expect(sequence.current).to.equal(undefined);
    expect(sequence.passed.length).to.equal(0);
    sequence.run();
    expect(sequence.current).to.equal(task1);
    expect(sequence.passed.length).to.equal(0);
    task1.complete();
    expect(sequence.current).to.equal(undefined);
    expect(sequence.passed.length).to.equal(2);
    expect(sequence.passed[0]).to.equal(task1);
    expect(sequence.passed[1]).to.equal(task2);
    expect(sequence.reset()).to.equal(true);
    expect(sequence.passed.length).to.equal(0);
  });

  it('to chain and unchain properly', () => {
    const sequence = new Sequence();
    const task = new Task();
    expect(task.chain).to.equal(undefined);
    sequence.push(task);
    expect(task.chain).to.equal(sequence);
    sequence.remove(task);
    expect(task.chain).to.equal(undefined);
    sequence.push(task);
    expect(task.chain).to.equal(sequence);
    sequence.run();
    expect(task.chain).to.equal(undefined);
    expect(sequence.passed.length).to.equal(1);
    expect(sequence.passed[0]).to.equal(task);
  });

  it('to reset the oncomplete after run', () => {
    const complete = () => {};
    const sequence = new Sequence();
    const task = new TriggerTask(complete);
    expect(task.__injected__sequenceAfterComplete).to.equal(undefined);
    sequence.push(task);
    expect(task.__injected__sequenceAfterComplete).to.equal(undefined);
    sequence.run();
    expect(task.__injected__sequenceAfterComplete).to.equal(complete);
    task.complete();
    expect(task.__injected__sequenceAfterComplete).to.equal(undefined);
  });

  it('to reset the oncomplete on force stop', () => {
    const complete = () => {};
    const sequence = new Sequence();
    const task = new TriggerTask(complete);
    expect(task.__injected__sequenceAfterComplete).to.equal(undefined);
    sequence.push(task);
    expect(task.__injected__sequenceAfterComplete).to.equal(undefined);
    sequence.run();
    expect(task.__injected__sequenceAfterComplete).to.equal(complete);
    sequence.stop();
    expect(task.__injected__sequenceAfterComplete).to.equal(complete);
    sequence.run();
    expect(task.__injected__sequenceAfterComplete).to.equal(complete);
    sequence.stop(true);
    expect(task.__injected__sequenceAfterComplete).to.equal(undefined);
  });

});
