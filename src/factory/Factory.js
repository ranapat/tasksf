import RawMap from './RawMap';

class Factory {
  static maps = [];
  static initialized = false;

  static get(...args) {
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

  static initialize(force = false) {
    if (!Factory.initialized || force) {
      Factory.initialized = true;

      Factory.maps = [
        new RawMap()
      ];
    }
  }

  static register(map) {
    if (Factory.maps.indexOf(map) === -1) {
      Factory.maps.push(map);
    }
  }

  static unregister(map) {
    const index = Factory.maps.indexOf(map);
    if (index !== -1) {
      Factory.maps.splice(index, 1);
    }
  }

  static unregisterAll() {
    Factory.maps = [];
  }
}

export default Factory;
