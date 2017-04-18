import Map from './Map';
import Match from './Match';
import TriggerTask from '../tasks/TriggerTask';

class TriggerMap extends Map {
  match(...args) {
    if (
      args.length === 1
      && typeof args[0] === 'function'
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
