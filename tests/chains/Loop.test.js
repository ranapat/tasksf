import chai from 'chai';
import chai_spies from 'chai-spies';
import { expect } from 'chai';
import { Task, TimeoutTask } from '../../src';
import { Loop } from '../../src';

describe('Test Loop', () => {
  chai.use(chai_spies);

  it('to loop fixed times (1)', () => {
    const taskRun = chai.spy((self) => {});
    const taskComplete = chai.spy((self) => {});
    const complete = chai.spy((self) => {});
    const loop = new Loop(1, complete);
    const task = new Task(taskRun, taskComplete);
    loop.push(task);
    loop.run();
    expect(taskRun).to.have.been.called().once;
    expect(taskComplete).to.have.been.called().once;
    expect(complete).to.have.been.called().once;
  });

  it('to loop fixed times (2)', () => {
    const taskRun = chai.spy((self) => {});
    const taskComplete = chai.spy((self) => {});
    const complete = chai.spy((self) => {});
    const loop = new Loop(2, complete);
    const task = new Task(taskRun, taskComplete);
    loop.push(task);
    loop.run();
    expect(taskRun).to.have.been.called().twice;
    expect(taskComplete).to.have.been.called().twice;
    expect(complete).to.have.been.called().twice;
  });

  it('to loop fixed times (3)', () => {
    const task1Run = chai.spy((self) => {});
    const task1Complete = chai.spy((self) => {});
    const task2Run = chai.spy((self) => {});
    const task2Complete = chai.spy((self) => {});
    const complete = chai.spy((self) => {});
    const loop = new Loop(2, complete);
    const task1 = new Task(task1Run, task1Complete);
    const task2 = new Task(task2Run, task2Complete);
    loop.push(task1).push(task2);
    loop.run();
    expect(task1Run).to.have.been.called().twice;
    expect(task1Complete).to.have.been.called().twice;
    expect(task2Run).to.have.been.called().twice;
    expect(task2Complete).to.have.been.called().twice;
    expect(complete).to.have.been.called().twice;
  });

  it('to loop unlimited times', () => {
    let counter = 0;
    const taskRun = chai.spy((self) => {});
    const taskComplete = chai.spy((self) => {});
    const complete = chai.spy((self) => {
      if (++counter === 10) {
        loop.stop();
      }
    });
    const loop = new Loop(0, complete);
    const task = new Task(taskRun, taskComplete);
    loop.push(task);
    loop.run();
    expect(taskRun).to.have.been.called().ten;
    expect(taskComplete).to.have.been.called().ten;
    expect(complete).to.have.been.called().ten;
  });
});
