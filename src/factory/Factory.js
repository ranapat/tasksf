import RawMap from './RawMap';
import TimeoutMap from './TimeoutMap';
import TriggerMap from './TriggerMap';

import Sequence from '../chains/Sequence';

class Factory {
  static _CHAIN_ = '_chain_';

  static maps = [];
  static initialized = false;

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

  static sequence(complete, recover) {
    return new Sequence(complete, recover);
  }

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

  static map(map) {
    if (Factory.maps.indexOf(map) === -1) {
      Factory.maps.push(map);
    }
  }

  static unmap(map) {
    const index = Factory.maps.indexOf(map);
    if (index !== -1) {
      Factory.maps.splice(index, 1);
    }
  }

  static unmapAll() {
    Factory.maps = [];
  }
}

export default Factory;
