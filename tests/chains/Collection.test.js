import { expect } from 'chai';
import { Sequence } from '../../src';

describe('Test Collection', () => {
  it('to chain calls for push, unshift and remove', () => {
    const sequence = new Sequence();
    expect(sequence.push()).to.be.an.instanceof(Sequence);
    expect(sequence.unshift()).to.be.an.instanceof(Sequence);
    expect(sequence.remove()).to.be.an.instanceof(Sequence);
  });

});
