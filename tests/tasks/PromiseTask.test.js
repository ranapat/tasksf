import chai from 'chai';
import chai_spies from 'chai-spies';
import { expect } from 'chai';
import Promise from '../_mockups/Promise';
import { PromiseTask } from '../../src';

describe('Test PromiseTask', () => {
  chai.use(chai_spies);

  it('to be identifying promises correctly', () => {
    const task1 = new PromiseTask();
    expect(task1._promise).to.equal(undefined);

    const promise2 = 'test';
    const task2 = new PromiseTask(promise2);
    expect(task2._promise).to.equal(undefined);

    const promise3 = new Promise();
    const task3 = new PromiseTask(promise3);
    expect(task3._promise).to.equal(promise3);
  });

  it('to be starting and waiting', () => {
    const task = new PromiseTask();
    task.run();
    expect(task.running).to.equal(true);
    expect(task.done).to.equal(false);
    task.complete();
    expect(task.done).to.equal(true);
  });

  it('to be starting and waiting for resolve', () => {
    const promise = new Promise();
    const complete = chai.spy(() => {});
    const task = new PromiseTask(promise, complete);

    expect(task.running).to.equal(false);
    expect(task.done).to.equal(false);
    expect(complete).not.to.have.been.called();

    task.run();

    expect(task.running).to.equal(true);
    expect(task.done).to.equal(false);
    expect(complete).not.to.have.been.called();

    promise.resolve();
    expect(task.running).to.equal(false);
    expect(task.done).to.equal(true);
    expect(complete).to.have.been.called();
  });

  it('to be starting and completing if resolved before', () => {
    const promise = new Promise();
    const complete = chai.spy(() => {});
    const task = new PromiseTask(promise, complete);

    expect(task.running).to.equal(false);
    expect(task.done).to.equal(false);
    expect(complete).not.to.have.been.called();

    promise.resolve();

    expect(task.running).to.equal(false);
    expect(task.done).to.equal(false);
    expect(complete).not.to.have.been.called();

    task.run();

    expect(task.running).to.equal(false);
    expect(task.done).to.equal(true);
    expect(complete).to.have.been.called();
  });

});
