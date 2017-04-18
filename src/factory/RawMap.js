import Map from './Map';
import Match from './Match';
import Task from '../tasks/Task';

class RawMap extends Map {
  match(...args) {
    if (
      args.length === 3
      && typeof args[0] === 'function'
      && typeof args[1] === 'function'
      && typeof args[1] === 'function'
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
