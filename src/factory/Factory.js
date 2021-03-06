import RawMap from './RawMap';
import TimeoutMap from './TimeoutMap';
import TriggerMap from './TriggerMap';
import AsyncMap from './AsyncMap';
import PromiseMap from './PromiseMap';

import Sequence from '../chains/Sequence';
import Parallel from '../chains/Parallel';
import Loop from '../chains/Loop';
import Limiter from '../chains/Limiter';

/**
 * Tasks and Collections Factory
 *
 * It's a static class - do not instantiate with new
 *
 * @static
 */
class Factory {
  /**
   * Predefined name for a chain in attached task
   *
   * @param {string} _CHAIN_ predefined name
   */
  static _CHAIN_ = '_chain_';

  /**
   * Maps collection for task matching
   *
   * @param {Array<Map>} maps list of all maps
   */
  static maps = [];

  /**
   * Attached variables
   *
   * @param {object} attached collection of any attachments
   */
  static attached = {};

  /**
   * Initialized status
   *
   * @param {boolean} initialized initialized status
   */
  static initialized = false;

  /**
   * Gets a task by registered map match
   *
   * @param {any} args parameters depend on installed maps
   * @return {Task} task matching the parameters
   */
  static task(...args) {
    Factory.initialize();

    let match;
    Factory.maps.forEach((item) => {
      const result = item.match(...args);

      if (result !== undefined) {
        if (match === undefined) {
          match = result;
        } else if (match.percentage <= result.percentage) {
          match = result;
        }
      }
    });

    return match !== undefined ? match.instance : undefined;
  }

  /**
   * Gets a sequence
   *
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   * @return {Sequence} new sequence
   */
  static sequence(complete, recover) {
    Factory.initialize();

    return new Sequence(complete, recover);
  }

  /**
   * Gets a parallel
   *
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   * @param {boolean} completeOnFirst completes on last or on first
   * @return {Parallel} new sequence
   */
  static parallel(complete, recover, completeOnFirst) {
    Factory.initialize();

    return new Parallel(complete, recover, completeOnFirst);
  }

  /**
   * Gets a loop
   *
   * @param {number} repeats number of repeats, 0 for infinite
   * @param {Function} repeat function to be called on repeat
   * @param {Function} recover function to be called on recover
   * @return {Loop} new loop
   */
  static loop(repeats, repeat, recover) {
    Factory.initialize();

    return new Loop(repeats, repeat, recover);
  }

  /**
   * Gets a limiter
   *
   * @param {number} limit max running tasks
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   * @param {boolean} completeOnFirst completes on last or on first
   * @return {Limiter} new limiter
   */
  static limiter(limit, complete, recover, completeOnFirst) {
    Factory.initialize();

    return new Limiter(limit, complete, recover, completeOnFirst);
  }

  /**
   * Initializes the factory.
   *
   * Initializes the factory. Will be called automatically on first task
   * or sequence call. Can be called explicitly with *force*
   *
   * @param {boolean} force reinitialize if true
   */
  static initialize(force = false) {
    if (!Factory.initialized || force) {
      Factory.initialized = true;

      Factory.maps = [
        new RawMap(),
        new TimeoutMap(),
        new TriggerMap(),
        new AsyncMap(),
        new PromiseMap()
      ];
    }
  }

  /**
   * Adds new map for tasks matching
   *
   * @param {Map} map map for tasks matching
   */
  static map(map) {
    if (Factory.maps.indexOf(map) === -1) {
      Factory.maps.push(map);
    }
  }

  /**
   * Removes map from tasks matching
   *
   * @param {Map} map map to remove from tasks matching
   */
  static unmap(map) {
    const index = Factory.maps.indexOf(map);
    if (index !== -1) {
      Factory.maps.splice(index, 1);
    }
  }

  /**
   * Removes all maps
   */
  static unmapAll() {
    Factory.maps = [];
  }

  /**
   * Attaches variable to the factory
   *
   * Useful to store your collections and access them
   * later on from anywhere. Or store anything you want
   * in this predefined place
   *
   * @param {string} key accessor for the variable
   * @param {any} value variable value
   */
  static attach(key, value) {
    Factory.attached[key] = value;
  }

  /**
   * Detaches variable by name
   *
   * @param {string} key accessor for the variable
   */
  static detach(key) {
    delete Factory.attached[key];
  }

  /**
   * Gets variable by name
   *
   * @param {string} key accessor for the variable
   * @return {any} variable value
   */
  static get(key) {
    return Factory.attached[key];
  }
}

export default Factory;
