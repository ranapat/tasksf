import Map from './Map';
import Match from './Match';
import Task from '../tasks/Task';

/**
 * Raw map for Task
 *
 * Maps the default ways to get a Task
 */
class RawMap extends Map {
  /**
   * Match argument with a specific Task
   *
   * @param {Function} run function to be called on run
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   * @return {Match} match
   */
  match(...args) {
    if (
      args.length === 3
      && typeof args[0] === 'function'
      && typeof args[1] === 'function'
      && typeof args[2] === 'function'
    ) {
      return new Match(new Task(...args));
    } else if (
      args.length === 2
      && typeof args[0] === 'function'
      && typeof args[1] === 'function'
    ) {
      return new Match(new Task(...args));
    } else if (
      args.length === 1
      && typeof args[0] === 'function'
    ) {
      return new Match(new Task(...args));
    } else {
      return undefined;
    }
  }
}

export default RawMap;
