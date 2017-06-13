import Map from './Map';
import Match from './Match';
import AsyncTask from '../tasks/AsyncTask';

/**
 * Map for AsyncTask
 *
 * Maps the default ways to get a AsyncTask
 */
class AsyncMap extends Map {
  /**
   * Match argument with a specific TriggerMap
   *
   * @param {Function} run function to be called on run
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   * @param {number} marker 0 marks a async task
   * @return {Match} match
   */
  match(...args) {
    if (
      args.length === 4
      && typeof args[0] === 'function'
      && typeof args[1] === 'function'
      && typeof args[2] === 'function'
      && args[3] === 0
    ) {
      return new Match(new AsyncTask(...args.slice(0, -1)));
    } else if (
      args.length === 3
      && typeof args[0] === 'function'
      && typeof args[1] === 'function'
      && args[2] === 0
    ) {
      return new Match(new AsyncTask(...args.slice(0, -1)));
    } else if (
      args.length === 2
      && typeof args[0] === 'function'
      && args[1] === 0
    ) {
      return new Match(new AsyncTask(...args.slice(0, -1)));
    } else {
      return undefined;
    }
  }
}

export default AsyncMap;
