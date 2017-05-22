import chai from 'chai';
import chai_spies from 'chai-spies';
import { expect } from 'chai';
import { Task, TimeoutTask } from '../../src';
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
});
