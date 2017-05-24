import Factory from '../factory/Factory';

/**
 * Injector. Internal class
 *
 * Injects functions into objects. Used internally.
 * Not intended to be used on it's own.
 *
 * @static
 */
class Injector {
  /**
   * Appends a function after complete and remembers the original
   *
   * @param {Task} task task to be modified
   * @param {Function} callback function to be called after complete
   * @param {String} key map for the original callback
   * @return {Task} task modified task
   */
  static afterComplete(task, callback, key) {
    Injector.resetAfterComplete(task, key);

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
      callback(error, self, ...args);
    };

    return task;
  }

  /**
   * Resets the complete method to it's original state
   *
   * @param {Task} task task to be modified
   * @param {String} key map for the original callback
   * @return {Task} task modified task
   */
  static resetAfterComplete(task, key) {
    const original = task['__injected__' + key];
    if (original !== undefined) {

      task._complete = original;
    }

    delete task['__injected__' + key];

    return task;
  }

  /**
   * Adds a method called chain to get Factory._CHAIN_
   *
   * Shortcut for task.get(Factory._CHAIN_)
   *
   * @param {Task} task task to be modified
   * @return {Task} task modified task
   */
  static addChainGetter(task) {
    Object.defineProperty(task, 'chain', {
      get: function () {
        return this.get(Factory._CHAIN_);
      },
      configurable: true,
      enumerable: true
    });

    return task;
  }

  /**
   * Remove a method called chain to get Factory._CHAIN_
   *
   * @param {Task} task task to be modified
   * @return {Task} task modified task
   */
  static removeChainGetter(task) {
    delete task.chain;

    return task;
  }
}

export default Injector;
