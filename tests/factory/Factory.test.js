import { expect } from 'chai';
import { Factory, tf } from '../../src';
import { Map, Match } from '../../src';
import { Task, TimeoutTask, TriggerTask } from '../../src';

describe('Test Factory', () => {
  let mapsByDefault;

  it('to be accessible and short-named', () => {
    expect(tf).to.equal(Factory);
  });

  it('to be not initialized initially', () => {
    expect(tf.initialized).to.equal(false);
  });

  it('to be initialized on the first get', () => {
    tf.get();
    expect(tf.initialized).to.equal(true);

    mapsByDefault = tf.maps.length;
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

  it('to force initialize', () => {
    tf.unregisterAll();
    expect(tf.maps.length).to.equal(0);
    tf.initialize();
    expect(tf.maps.length).to.equal(0);
    tf.initialize(true);
    expect(tf.maps.length).to.equal(mapsByDefault);
  });

  it('to get Task from 3 functions', () => {
    tf.initialize(true);
    const task = tf.get(
      () => {}, () => {}, () => {}
    );
    expect(task).to.be.an.instanceof(Task);
  });

  it('to get Task from 2 functions', () => {
    tf.initialize(true);
    const task = tf.get(
      () => {}, () => {}
    );
    expect(task).to.be.an.instanceof(Task);
  });

  it('to get Task from 1 function', () => {
    tf.initialize(true);
    const task = tf.get(
      () => {}
    );
    expect(task).to.be.an.instanceof(Task);
  });

  it('to get no TriggerTask from undefined', () => {
    tf.initialize(true);
    const task = tf.get(
    );
    expect(task).to.be.an.instanceof(TriggerTask);
  });

  it('to get TimeoutTask from timeout and 3 functions', () => {
    tf.initialize(true);
    const task = tf.get(
      1,
      () => {}, () => {}, () => {}
    );
    expect(task).to.be.an.instanceof(TimeoutTask);
  });

  it('to get TimeoutTask from timeout and 2 functions', () => {
    tf.initialize(true);
    const task = tf.get(
      1,
      () => {}, () => {}
    );
    expect(task).to.be.an.instanceof(TimeoutTask);
  });

  it('to get TimeoutTask from timeout and 1 function', () => {
    tf.initialize(true);
    const task = tf.get(
      1,
      () => {}
    );
    expect(task).to.be.an.instanceof(TimeoutTask);
  });

  it('to get TimeoutTask from timeout', () => {
    tf.initialize(true);
    const task = tf.get(
      1
    );
    expect(task).to.be.an.instanceof(TimeoutTask);
  });

  it('to get task with better priority', () => {
    tf.initialize(true);

    const TaskA = class extends Task {};
    const TaskB = class extends Task {};
    const TaskC = class extends Task {};

    const matchA = new Match(new TaskA(), 0.90);
    const matchB = new Match(new TaskB(), 0.95);
    const matchC = new Match(new TaskC());

    const mapA = new class extends Map {
      match(...args) {
        return matchA;
      }
    };
    const mapB = new class extends Map {
      match(...args) {
        return matchB;
      }
    };
    const mapC = new class extends Map {
      match(...args) {
        return matchC;
      }
    };

    tf.register(mapA);
    tf.register(mapB);
    tf.register(mapC);

    const task = tf.get();
    expect(task).to.be.an.instanceof(TaskB);
  });

});
