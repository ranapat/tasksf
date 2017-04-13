import Map from './Map';
import Task from '../tasks/Task';

class RawMap extends Map {
  match(...args) {
    if (
      args.length === 3
      && typeof args[0] === 'function'
      && typeof args[1] === 'function'
      && typeof args[1] === 'function'
    ) {
      return new Task(...args);
    } else {
      return undefined;
    }
  }
}

export default RawMap;
