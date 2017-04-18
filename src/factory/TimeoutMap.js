import Map from './Map';
import Match from './Match';
import TimeoutTask from '../tasks/TimeoutTask';

class TimeoutMap extends Map {
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
