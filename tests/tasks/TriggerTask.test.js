import { expect } from 'chai';
import { TriggerTask } from '../../src';

describe('Test TriggerTask', () => {
  it('to be starting and waiting', () => {
    const task = new TriggerTask();
    task.run();
    expect(task.running).to.equal(true);
    expect(task.done).to.equal(false);
    task.complete();
    expect(task.done).to.equal(true);
  });

});
