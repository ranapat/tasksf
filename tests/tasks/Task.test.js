import chai from 'chai';
import chai_spies from 'chai-spies';
import { expect } from 'chai';
import { Task } from '../../src';

describe('Test Task', () => {

  function check(done, f) {
    try {
      f();
      done();
    } catch(e) {
      done(e);
    }
  }

  chai.use(chai_spies);

  it('to be not done before run', () => {
    const task = new Task();
    expect(task.done).to.equal(false);
  });

  it('to be done after run', () => {
    const task = new Task();
    task.run();
    expect(task.done).to.equal(true);
  });

  it('to be not running before run', () => {
    const task = new Task();
    expect(task.running).to.equal(false);
  });

  it('to be not running after complete', () => {
    const task = new Task();
    task.run();
    expect(task.running).to.equal(false);
  });

  it('to be running during run', () => {
    const task = new Task(() => {
      return 1;
    });
    task.run();
    expect(task.running).to.equal(true);
  });

  it('to be not stopping by default', () => {
    const task = new Task();
    expect(task.stop()).to.equal(false);
    task.run();
    expect(task.stop()).to.equal(false);
  });

  it('to be starting if asked to restarted when stopped', () => {
    const task = new Task();
    expect(task.stop()).to.equal(false);
    expect(task.restart()).to.equal(true);
    expect(task.done).to.equal(true);
  });

  it('to be stopping and restarting in the same manner if running', () => {
    const task = new Task();
    task._running = true;
    expect(task.stop()).to.equal(false);
    expect(task.restart()).to.equal(false);
  });

  it('to not recover by default', () => {
    const task = new Task();
    task.recover();
    expect(task.done).to.equal(false);
  });

  it('to recover if needed', () => {
    const task = new Task(undefined, undefined, () => { return 1; });
    task.recover();
    expect(task.done).to.equal(true);
  });

  it('to receive parameters from recover to run if needed', (done) => {
    const task = new Task(
      (self, recover) => { check(done, () => { expect(recover).to.equal('recover'); }) },
      undefined,
      () => { return 'recover'; }
    );
    task.recover();
    expect(task.done).to.equal(true);
  });

  it('to not complete automatically if needed', () => {
    const task = new Task(() => { return 1; }, undefined, undefined);
    task.run();
    expect(task.done).to.equal(false);
  });

  it('to complete later if needed', (done) => {
    const task = new Task(
      (self) => {
        setTimeout(() => { self.complete(); }, 1);
        return 'something';
      },
      undefined, undefined
    );
    task.run();
    expect(task.done).to.equal(false);
    setTimeout(() => { expect(task.done).to.equal(true); done(); }, 1);
  });

  it('to be running during run and not running on complete', (done) => {
    const task = new Task(
      (self) => {
        setTimeout(() => { self.complete(); }, 1);
        return 'something';
      },
      undefined, undefined
    );
    task.run();
    expect(task.running).to.equal(true);
    setTimeout(() => { expect(task.running).to.equal(false); done(); }, 1);
  });

  it('to resolve exceptions and not crash', () => {
    const task = new Task(
      () => {
        throw new Error('error')
      },
      () => {
        throw new Error('error')
      },
      () => {
        throw new Error('error')
      }
    );
    task.run();
    task.recover();
  });

  it('to collect exceptions and report as failed', () => {
    const task = new Task(
      () => {
        throw new Error('run error')
      },
      () => {
        throw new Error('complete error')
      },
      () => {
        throw new Error('recover error')
      }
    );
    task.run();
    task.recover();
    expect(task.failed).to.equal(true);
    expect(task.exceptions.run.message).to.equal('run error');
    expect(task.exceptions.complete.message).to.equal('complete error');
    expect(task.exceptions.recover.message).to.equal('recover error');
  });

  it('to pass errors from run to complete', (done) => {
    const task = new Task(
      () => {
        throw new Error('run error');
      },
      (self, error) => {
        expect(error.message).to.equal('run error');
        done();
      }
    );
    task.run();
  });

  it('to alter the complete with extra callback', () => {
    const complete = chai.spy((self) => {});
    const extra = chai.spy((self) => {});
    const task = new Task(undefined, complete, undefined);
    const current = task._complete;
    task._complete = (self, ...args) => {
      current(self, ...args);
      extra(self, ...args);
    };
    task.run();
    expect(complete).to.have.been.called();
    expect(extra).to.have.been.called();
  });

  it('to attach', (done) => {
    const test = 'this is a test attachment';
    const run = (self) => {
      check(done, () => {
        expect(self.get('test')).to.equal(test);
      });
    };
    const task = new Task(run, undefined, undefined);
    task.attach('test', test);
    task.run();
  });

  it('to detach', (done) => {
    const test = 'this is a test attachment';
    const run = (self) => {
      check(done, () => {
        expect(self.get('test')).to.equal(undefined);
      });
    };
    const task = new Task(run, undefined, undefined);
    task.attach('test', test);
    task.detach('test');
    task.run();
  });

});
