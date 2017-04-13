import { expect } from 'chai';
import { Factory, tf } from '../../src';

describe('Test Factory', () => {

  it('to be accessible and short-named', () => {
    expect(tf).to.equal(Factory);
  });

  it('to be not initialized initially', () => {
    expect(tf.initialized).to.equal(false);
  });

  it('to be initialized on the first get', () => {
    tf.get();
    expect(tf.initialized).to.equal(true);
  });

  it('to unregister all maps', () => {
    tf.unregisterAll();
    expect(tf.maps.length).to.equal(0);
    const map = new Map();
    tf.register(map);
    expect(tf.maps.length).to.equal(1);
    tf.unregisterAll();
    expect(tf.maps.length).to.equal(0);
  });

  it('to register and unregister maps', () => {
    tf.unregisterAll();
    expect(tf.maps.length).to.equal(0);
    const map = new Map();
    tf.register(map);
    expect(tf.maps.length).to.equal(1);
    tf.unregister(map);
    expect(tf.maps.length).to.equal(0);
  });

  it('to register and unregister maps', () => {
    tf.unregisterAll();
    expect(tf.maps.length).to.equal(0);
    const map = new Map();
    tf.register(map);
    tf.register(map);
    expect(tf.maps.length).to.equal(1);
  });

});
