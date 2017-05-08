import Factory from '../factory/Factory';

class Injector {
  static afterComplete(task, callback) {
    const current = task._complete;
    task._complete = (self, ...args) => {
      let error;
      try {
        if (current !== undefined) {
          current(self, ...args);
        }
      } catch (e) {
        error = e;
      }
      callback(error, ...args);
    };
    return task;
  }

  static addChainGetter(task) {
    Object.defineProperty(task, 'chain', {
      get: function () {
        return this.get(Factory._CHAIN_);
      },
      configurable: true,
      enumerable: true
    });
  }

  static removeChainGetter(task) {
    delete task.chain;
  }
}

export default Injector;
