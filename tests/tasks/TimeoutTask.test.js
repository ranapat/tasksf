import chai from 'chai';
import chai_spies from 'chai-spies';
import { expect } from 'chai';
import { TimeoutTask } from '../../src';

describe('Test TimeoutTask', () => {
  chai.use(chai_spies);

  it('to be starting with timeout offset', (done) => {
    const task = new TimeoutTask(1);
    task.run();
    expect(task.running).to.equal(true);
    expect(task.done).to.equal(false);
    setTimeout(() => {
      expect(task.running).to.equal(false);
      expect(task.done).to.equal(true);
      done();
    }, 1);
  });

  it('to have run called after timeout', (done) => {
    const run = chai.spy(() => {});
    const task = new TimeoutTask(1, run);
    task.run();
    expect(run).not.to.have.been.called();
    setTimeout(() => {
      expect(run).to.have.been.called();
      done();
    }, 1);
  });

  it('to have complete called after timeout', (done) => {
    const complete = chai.spy(() => {});
    const task = new TimeoutTask(1, undefined, complete);
    task.run();
    expect(complete).not.to.have.been.called();
    setTimeout(() => {
      expect(complete).to.have.been.called();
      done();
    }, 1);
  });

  it('to have stop on time', (done) => {
    const complete = chai.spy(() => {});
    const task = new TimeoutTask(1, undefined, complete);
    task.run();
    expect(task.stop()).to.equal(true);
    expect(complete).not.to.have.been.called();
    setTimeout(() => {
      expect(complete).not.to.have.been.called();
      done();
    }, 1);
  });

  it('to run on restart', (done) => {
    const complete = chai.spy(() => {});
    const task = new TimeoutTask(1, undefined, complete);
    expect(task.restart()).to.equal(true);
    expect(task.running).to.equal(true);
    expect(complete).not.to.have.been.called();
    setTimeout(() => {
      expect(complete).to.have.been.called();
      done();
    }, 1);
  });

  it('to have restart on time', (done) => {
    const complete = chai.spy(() => {});
    const task = new TimeoutTask(1, undefined, complete);
    task.run();
    expect(task.restart()).to.equal(true);
    expect(complete).not.to.have.been.called();
    setTimeout(() => {
      expect(complete).to.have.been.called();
      done();
    }, 1);
  });

  it('to populate and reset _index (1)', () => {
    const task = new TimeoutTask(1);
    expect(task._index).to.equal(undefined);
    task.run();
    expect(task._index).not.to.equal(undefined);
    task.stop();
    expect(task._index).to.equal(undefined);
  });

  it('to populate and reset _index (2)', () => {
    const task = new TimeoutTask(1);
    expect(task._index).to.equal(undefined);
    task.run();
    expect(task._index).not.to.equal(undefined);
    task.complete();
    expect(task._index).to.equal(undefined);
  });

  it('to populate and reset _index (3)', () => {
    const task = new TimeoutTask(1);
    expect(task._index).to.equal(undefined);
    task.run();
    expect(task._index).not.to.equal(undefined);
    task.restart();
    expect(task._index).not.to.equal(undefined);
  });
});
