import { expect } from 'chai';
import { Match } from '../../src';

describe('Test Match', () => {

  it('to populate variables', () => {
    const instance = new class {};
    const match = new Match(instance, 1);
    expect(match.instance).to.equal(instance);
    expect(match.percentage).to.equal(1);
  });

  it('to keep percentage between 0 and 1', () => {
    const match = new Match(undefined, 0.5);
    expect(match.percentage).to.equal(0.5);
    match.percentage = 10;
    expect(match.percentage).to.equal(1);
    match.percentage = -1;
    expect(match.percentage).to.equal(0);
    match.percentage = 1;
    expect(match.percentage).to.equal(1);
    match.percentage = 0;
    expect(match.percentage).to.equal(0);
  });

});
