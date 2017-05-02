import { expect } from 'chai';
import { Task, Sequence, Factory } from '../../src';

describe('Test Collection', () => {
  it('to chain calls for push, unshift and remove', () => {
    const task = new Task();
    const sequence = new Sequence();
    expect(sequence.push(task)).to.be.an.instanceof(Sequence);
    expect(sequence.unshift(task)).to.be.an.instanceof(Sequence);
    expect(sequence.remove(task)).to.be.an.instanceof(Sequence);
  });

  it('to attach itself on add and detach on remove', () => {
    const task = new Task();
    const sequence = new Sequence();
    expect(task.get(Factory._CHAIN_)).to.equal(undefined);
    sequence.push(task);
    expect(task.get(Factory._CHAIN_)).to.equal(sequence);
    sequence.remove(task);
    expect(task.get(Factory._CHAIN_)).to.equal(undefined);
    sequence.unshift(task);
    expect(task.get(Factory._CHAIN_)).to.equal(sequence);
    sequence.remove(task);
    expect(task.get(Factory._CHAIN_)).to.equal(undefined);
  });

});
