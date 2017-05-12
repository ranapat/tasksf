import Map from './Map';
import Match from './Match';
import TimeoutTask from '../tasks/TimeoutTask';

/**
 * Map for TimeoutTasks
 *
 * Maps the default ways to get a TimeoutTask
 */
class TimeoutMap extends Map {
  /**
   * Match argument with a specific TimeoutTask
   *
   * @param {number} timeout timeout in ms
   * @param {Function} run function to be called on run
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   * @return {Match} match
   */
  match(...args) {
    if (
      args.length === 4
      && typeof args[0] === 'number'
      && typeof args[1] === 'function'
      && typeof args[2] === 'function'
      && typeof args[3] === 'function'
    ) {
      return new Match(new TimeoutTask(...args));
    } else if (
      args.length === 3
      && typeof args[0] === 'number'
      && typeof args[1] === 'function'
      && typeof args[2] === 'function'
    ) {
      return new Match(new TimeoutTask(...args));
    } else if (
      args.length === 2
      && typeof args[0] === 'number'
      && typeof args[1] === 'function'
    ) {
      return new Match(new TimeoutTask(...args));
    } else if (
      args.length === 1
      && typeof args[0] === 'number'
    ) {
      return new Match(new TimeoutTask(...args));
    } else {
      return undefined;
    }
  }
}

export default TimeoutMap;
