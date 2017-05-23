import { expect } from 'chai';
import { Task, Collection, Sequence, Factory } from '../../src';

describe('Test Collection', () => {
  it('to chain calls for push, unshift and remove', () => {
    const task = new Task();
    const sequence = new Sequence();
    expect(sequence.push(task)).to.be.an.instanceof(Sequence);
    expect(sequence.unshift(task)).to.be.an.instanceof(Sequence);
    expect(sequence.remove(task)).to.be.an.instanceof(Sequence);
  });

  it('to attach itself in complete and recover', () => {
    const collection = new Sequence();
    expect(collection.__complete).not.to.equal(undefined);
    expect(collection.__complete.get(Factory._CHAIN_)).to.equal(collection);
    expect(collection.__complete.chain).to.equal(collection);
    expect(collection.__recover).not.to.equal(undefined);
    expect(collection.__recover.get(Factory._CHAIN_)).to.equal(collection);
    expect(collection.__recover.chain).to.equal(collection);
  });

  it('to attach itself on add and detach on remove 1', () => {
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

  it('to attach itself on add and detach on remove 2', () => {
    const task = new Task();
    const sequence = new Sequence();
    expect(task.chain).to.equal(undefined);
    expect(task.get(Factory._CHAIN_)).to.equal(undefined);
    sequence.push(task);
    expect(task.chain).to.equal(sequence);
    expect(task.get(Factory._CHAIN_)).to.equal(sequence);
    sequence.remove(task);
    expect(task.chain).to.equal(undefined);
    expect(task.get(Factory._CHAIN_)).to.equal(undefined);
    sequence.unshift(task);
    expect(task.chain).to.equal(sequence);
    expect(task.get(Factory._CHAIN_)).to.equal(sequence);
    sequence.remove(task);
    expect(task.chain).to.equal(undefined);
    expect(task.get(Factory._CHAIN_)).to.equal(undefined);
  });

  it('to attach, detach and get', () => {
    const something = 'something';
    const sequence = new Sequence();
    expect(sequence.get('something')).to.equal(undefined);
    sequence.attach('something', something);
    expect(sequence.get('something')).to.equal(something);
    sequence.detach('something');
    expect(sequence.get('something')).to.equal(undefined);
  });

  it('to have current and passed as undefined', () => {
    const collection = new Collection();
    expect(collection.current).to.equal(undefined);
    expect(collection.passed).to.equal(undefined);
  });

  it('to reset if collection is not running', () => {
    const collection = new Collection();
    const task = new Task();
    const test = 'test';
    collection.attach('test', test);
    collection.push(task);
    expect(collection.get('test')).to.equal(test);
    expect(collection.tasks.length).to.equal(1);
    expect(task.chain).to.equal(collection);
    expect(collection.reset()).to.equal(true);
    expect(collection.get('test')).to.equal(undefined);
    expect(collection.tasks.length).to.equal(0);
    expect(task.chain).to.equal(undefined);
  });

  it('to not to reset if collection is running', () => {
    const task = new Task();
    const collection = new Collection();
    const test = 'test';
    collection.attach('test', test);
    collection.push(task);
    expect(collection.get('test')).to.equal(test);
    expect(collection.tasks.length).to.equal(1);
    expect(task.chain).to.equal(collection);
    collection.run();
    expect(collection.reset()).to.equal(false);
    expect(collection.get('test')).to.equal(test);
    expect(collection.tasks.length).to.equal(1);
    expect(task.chain).to.equal(collection);
    collection._complete();
    expect(collection.reset()).to.equal(true);
    expect(collection.get('test')).to.equal(undefined);
    expect(collection.tasks.length).to.equal(0);
    expect(task.chain).to.equal(undefined);
  });
});
