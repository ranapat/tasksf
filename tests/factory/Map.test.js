import { expect } from 'chai';
import { Map } from '../../src';

describe('Test Map', () => {

  it('to get undefiend from match', () => {
    const map = new Map();
    expect(map.match()).to.equal(undefined);
  });

});
