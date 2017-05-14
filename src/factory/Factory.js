import RawMap from './RawMap';
import TimeoutMap from './TimeoutMap';
import TriggerMap from './TriggerMap';

import Sequence from '../chains/Sequence';
import Loop from '../chains/Loop';

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
   * @param {array} maps list of all maps
   */
  static maps = [];

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
        new TriggerMap()
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
}

export default Factory;
