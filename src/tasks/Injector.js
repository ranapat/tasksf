import Factory from '../factory/Factory';

class Injector {
  static afterComplete(task, callback, key) {
    const current = task._complete;

    Object.defineProperty(task, '__injected__' + key, {
      configurable: true,
      enumerable: true,
      value: current
    });

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

  static resetAfterComplete(task, key) {
    const original = task['__injected__' + key];
    if (original !== undefined) {
      delete task['__injected__' + key];

      task._complete = original;
    }
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
