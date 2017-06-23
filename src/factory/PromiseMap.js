import Map from './Map';
import Match from './Match';
import PromiseTask from '../tasks/PromiseTask';

/**
 * Map for PromiseTask
 *
 * Maps the default ways to get a PromiseTask
 */
class PromiseMap extends Map {
  /**
   * Match argument with a specific PromiseMap
   *
   * @param {Promise} promise promise to wait for
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   * @return {Match} match
   */
  match(...args) {
    if (
      args.length === 3
      && typeof args[0] === 'object'
      && typeof args[1] === 'function'
      && typeof args[2] === 'function'
    ) {
      return new Match(new PromiseTask(...args));
    } else if (
      args.length === 2
      && typeof args[0] === 'object'
      && typeof args[1] === 'function'
    ) {
      return new Match(new PromiseTask(...args));
    } else if (
      args.length === 1
      && typeof args[0] === 'object'
    ) {
      return new Match(new PromiseTask(...args));
    } else {
      return undefined;
    }
  }
}

export default PromiseMap;
