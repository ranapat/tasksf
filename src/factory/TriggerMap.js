import Map from './Map';
import Match from './Match';
import TriggerTask from '../tasks/TriggerTask';

/**
 * Map for TriggerMap
 *
 * Maps the default ways to get a TriggerMap
 */
class TriggerMap extends Map {
  /**
   * Match argument with a specific TriggerMap
   *
   * @param {Function} complete function to be called on complete
   * @param {boolean} marker marks a trigger task
   * @return {Match} match
   */
  match(...args) {
    if (
      args.length === 2
      && typeof args[0] === 'function'
      && args[1] === false
    ) {
      return new Match(new TriggerTask(...args));
    } else if (
      args.length === 0
    ) {
      return new Match(new TriggerTask(...args), 0);
    } else {
      return undefined;
    }
  }
}

export default TriggerMap;
