import chai from 'chai';
import chai_spies from 'chai-spies';
import { expect } from 'chai';
import { Task, TimeoutTask, TriggerTask } from '../../src';
import { Limiter } from '../../src';

describe('Test Limiter', () => {
  chai.use(chai_spies);

  it('to fix parameters', () => {
    const limiter = new Limiter();
    expect(limiter._limit).to.equal(1);
  });

  it('to run the fixed amount in the same time (1)', () => {
    const limiter = new Limiter(2);
    limiter.push(new TriggerTask());
    limiter.push(new TriggerTask());
    limiter.push(new TriggerTask());
    limiter.push(new TriggerTask());
    expect(limiter.tasks.length).to.equal(4);
    limiter.run();
    expect(limiter.tasks.length).to.equal(2);
    expect(limiter.current.length).to.equal(2);
    expect(limiter.passed.length).to.equal(0);
  });

  it('to run the fixed amount in the same time (2)', () => {
    const limiter = new Limiter(2);
    const task1 = new TriggerTask();
    const task2 = new TriggerTask();
    const task3 = new TriggerTask();
    const task4 = new TriggerTask();
    const task5 = new TriggerTask();
    limiter.push(task1);
    limiter.push(task2);
    limiter.push(task3);
    limiter.push(task4);
    limiter.push(task5);
    expect(limiter.tasks.length).to.equal(5);
    limiter.run();
    expect(limiter.tasks.length).to.equal(3);
    expect(limiter.current.length).to.equal(2);
    expect(limiter.passed.length).to.equal(0);
    task1.complete();
    expect(limiter.tasks.length).to.equal(2);
    expect(limiter.current.length).to.equal(2);
    expect(limiter.passed.length).to.equal(1);
    task2.complete();
    expect(limiter.tasks.length).to.equal(1);
    expect(limiter.current.length).to.equal(2);
    expect(limiter.passed.length).to.equal(2);
    task3.complete();
    expect(limiter.tasks.length).to.equal(0);
    expect(limiter.current.length).to.equal(2);
    expect(limiter.passed.length).to.equal(3);
    task4.complete();
    expect(limiter.tasks.length).to.equal(0);
    expect(limiter.current.length).to.equal(1);
    expect(limiter.passed.length).to.equal(4);
    task5.complete();
    expect(limiter.tasks.length).to.equal(0);
    expect(limiter.current.length).to.equal(0);
    expect(limiter.passed.length).to.equal(5);
  });

});
