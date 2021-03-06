import chai from 'chai';
import chai_spies from 'chai-spies';
import { expect } from 'chai';
import { Task, TimeoutTask, TriggerTask } from '../../src';
import { Parallel } from '../../src';

describe('Test Parallel', () => {
  chai.use(chai_spies);

  it('to fix parameters (1)', () => {
    const parallel = new Parallel(undefined, undefined, true);
    expect(parallel._completeOnFirst).to.equal(true);
  });

  it('to fix parameters (2)', () => {
    const parallel = new Parallel();
    expect(parallel._completeOnFirst).to.equal(false);
  });

  it('to fix parameters (3)', () => {
    const parallel = new Parallel(undefined, undefined, 1);
    expect(parallel._completeOnFirst).to.equal(false);
  });

  it('to run all tasks at once (1)', () => {
    const parallelComplete = chai.spy((self) => {});
    const taskRun1 = chai.spy((self) => {});
    const taskComplete1 = chai.spy((self) => {});
    const taskRun2 = chai.spy((self) => {});
    const taskComplete2 = chai.spy((self) => {});
    const parallel = new Parallel(parallelComplete);
    const task1 = new Task(taskRun1, taskComplete1);
    const task2 = new Task(taskRun2, taskComplete2);
    expect(parallelComplete).not.to.have.been.called();
    expect(taskRun1).not.to.have.been.called();
    expect(taskComplete1).not.to.have.been.called();
    expect(taskRun2).not.to.have.been.called();
    expect(taskComplete2).not.to.have.been.called();
    parallel.push(task1);
    parallel.push(task2);
    parallel.run();
    expect(parallelComplete).to.have.been.called();
    expect(taskRun1).to.have.been.called();
    expect(taskComplete1).to.have.been.called();
    expect(taskRun2).to.have.been.called();
    expect(taskComplete2).to.have.been.called();
  });

  it('to run all tasks at once (2)', (done) => {
    let states = [];

    const parallelComplete = chai.spy((self) => {
      expect(states.length).to.equal(2);
      expect(states[0][0]).to.equal(1);
      expect(states[1][0]).to.equal(2);

      expect(states[0][1]).to.equal(false);
      expect(states[0][2]).to.equal(true);
      expect(states[0][3]).to.equal(true);
      expect(states[0][4]).to.equal(false);

      expect(states[1][1]).to.equal(false);
      expect(states[1][2]).to.equal(true);
      expect(states[1][3]).to.equal(false);
      expect(states[1][4]).to.equal(true);

      done();
    });
    const taskRun1 = chai.spy((self) => {});
    const taskComplete1 = chai.spy((self) => {
      states.push([
        1,
        task1.running, task1.done,
        task2.running, task2.done
      ]);
    });
    const taskRun2 = chai.spy((self) => {});
    const taskComplete2 = chai.spy((self) => {
      states.push([
        2,
        task1.running, task1.done,
        task2.running, task2.done
      ]);
    });
    const parallel = new Parallel(parallelComplete);
    const task1 = new TimeoutTask(1, taskRun1, taskComplete1);
    const task2 = new TimeoutTask(2, taskRun2, taskComplete2);
    parallel.push(task1);
    parallel.push(task2);
    expect(task1.running).to.equal(false);
    expect(task2.running).to.equal(false);
    expect(task1.done).to.equal(false);
    expect(task2.done).to.equal(false);
    parallel.run();
    expect(task1.running).to.equal(true);
    expect(task2.running).to.equal(true);
    expect(task1.done).to.equal(false);
    expect(task2.done).to.equal(false);
  });

  it('to run all tasks at once (3)', (done) => {
    let states = [];

    const parallelComplete = chai.spy((self) => {
      expect(states.length).to.equal(1);
      expect(states[0][0]).to.equal(1);

      expect(states[0][1]).to.equal(false);
      expect(states[0][2]).to.equal(true);
      expect(states[0][3]).to.equal(true);
      expect(states[0][4]).to.equal(false);

      done();
    });
    const taskRun1 = chai.spy((self) => {});
    const taskComplete1 = chai.spy((self) => {
      states.push([
        1,
        task1.running, task1.done,
        task2.running, task2.done
      ]);
    });
    const taskRun2 = chai.spy((self) => {});
    const taskComplete2 = chai.spy((self) => {
      states.push([
        2,
        task1.running, task1.done,
        task2.running, task2.done
      ]);
    });
    const parallel = new Parallel(parallelComplete, undefined, true);
    const task1 = new TimeoutTask(1, taskRun1, taskComplete1);
    const task2 = new TimeoutTask(2, taskRun2, taskComplete2);
    parallel.push(task1);
    parallel.push(task2);
    expect(task1.running).to.equal(false);
    expect(task2.running).to.equal(false);
    expect(task1.done).to.equal(false);
    expect(task2.done).to.equal(false);
    parallel.run();
    expect(task1.running).to.equal(true);
    expect(task2.running).to.equal(true);
    expect(task1.done).to.equal(false);
    expect(task2.done).to.equal(false);
  });

  it('to unchain on complete', () => {
    const parallel = new Parallel();
    const task = new TriggerTask();
    expect(task.chain).to.equal(undefined);
    parallel.push(task);
    expect(task.chain).to.equal(parallel);
    parallel.run();
    expect(task.chain).to.equal(parallel);
    task.complete();
    expect(task.chain).to.equal(undefined);
  });

  it('to unchain on exceptions', () => {
    const parallel = new Parallel();
    const task = new Task(() => {
      throw new Error('error');
    });
    parallel.push(task);
    parallel.run();
    expect(task.chain).to.equal(undefined);
  });

  it('to keep current and passed', () => {
    const parallel = new Parallel();
    const task = new TriggerTask();
    parallel.push(task);
    parallel.run();
    expect(parallel.current.length).to.equal(1);
    expect(parallel.current[0]).to.equal(task);
    expect(parallel.passed.length).to.equal(0);
    task.complete();
    expect(parallel.current.length).to.equal(0);
    expect(parallel.passed.length).to.equal(1);
    expect(parallel.passed[0]).to.equal(task);
  });

  it('to implement reset', () => {
    const parallel = new Parallel();
    const task = new TriggerTask();
    parallel.push(task);
    parallel.run();
    task.complete();
    expect(parallel.current.length).to.equal(0);
    expect(parallel.passed.length).to.equal(1);
    expect(parallel.passed[0]).to.equal(task);
    expect(parallel.reset()).to.equal(true);
    expect(parallel.current.length).to.equal(0);
    expect(parallel.passed.length).to.equal(0);
  });

  it('to implement stop (1)', () => {
    const complete1 = () => {};
    const complete2 = () => {};
    const parallel = new Parallel();
    const task1 = new TriggerTask(complete1);
    const task2 = new TriggerTask(complete2);
    parallel.push(task1);
    parallel.push(task2);
    parallel.run();
    expect(task1.__injected__parallelAfterComplete).to.equal(complete1);
    expect(task2.__injected__parallelAfterComplete).to.equal(complete2);
    parallel.stop();
    expect(task1.chain).to.equal(parallel);
    expect(task2.chain).to.equal(parallel);
    expect(task1.__injected__parallelAfterComplete).to.equal(complete1);
    expect(task2.__injected__parallelAfterComplete).to.equal(complete2);
    expect(parallel._current.length).to.equal(0);
    expect(parallel.tasks.length).to.equal(2);
  });

  it('to implement stop (2)', () => {
    const complete1 = () => {};
    const complete2 = () => {};
    const parallel = new Parallel();
    const task1 = new TriggerTask(complete1);
    const task2 = new TriggerTask(complete2);
    parallel.push(task1);
    parallel.push(task2);
    parallel.run();
    expect(task1.__injected__parallelAfterComplete).to.equal(complete1);
    expect(task2.__injected__parallelAfterComplete).to.equal(complete2);
    parallel.stop(true);
    expect(task1.chain).to.equal(undefined);
    expect(task2.chain).to.equal(undefined);
    expect(task1.__injected__parallelAfterComplete).to.equal(undefined);
    expect(task2.__injected__parallelAfterComplete).to.equal(undefined);
    expect(parallel._current.length).to.equal(0);
    expect(parallel.tasks.length).to.equal(0);
  });

  it('to implement stop (3)', () => {
    const complete1 = chai.spy((self) => {});
    const complete2 = chai.spy((self) => {});
    const complete = chai.spy((self) => {});
    const parallel = new Parallel(complete);
    const task1 = new TriggerTask(complete1);
    const task2 = new TriggerTask(complete2);
    parallel.push(task1);
    parallel.push(task2);
    parallel.run();
    parallel.stop();
    parallel.run();
    task1.complete();
    task2.complete();
    expect(complete1).to.have.been.called();
    expect(complete2).to.have.been.called();
    expect(complete).to.have.been.called();
  });

  it('to implement stop (4)', () => {
    const complete1 = chai.spy((self) => {});
    const complete2 = chai.spy((self) => {});
    const complete = chai.spy((self) => {});
    const parallel = new Parallel(complete);
    const task1 = new TriggerTask(complete1);
    const task2 = new TriggerTask(complete2);
    parallel.push(task1);
    parallel.push(task2);
    parallel.run();
    parallel.stop(true);
    parallel.run();
    task1.complete();
    task2.complete();
    expect(complete1).to.have.been.called();
    expect(complete2).to.have.been.called();
    expect(complete).not.to.have.been.called();
  });

});
