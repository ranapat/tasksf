import { expect } from 'chai';
import { Task } from '../../src';

describe('Test Task', () => {

  it('to be not done before run', () => {
    const task = new Task();
    expect(task.done).to.equal(false);
  });

  it('to be done after run', () => {
    const task = new Task();
    task.run();
    expect(task.done).to.equal(true);
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

  it('to receive parameters from recover to run if needed', () => {
    const task = new Task(
      (self, recover) => { expect(recover).to.equal('recover'); },
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

});
