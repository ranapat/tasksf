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

});