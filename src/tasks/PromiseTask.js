import Task from './Task';

/**
 * PromiseTask
 *
 * Takes a Promise and waits for it to complete.
 * Will attack to finally and complete.
 * Useful for triggers.
 *
 * Similar with TriggerTask, but with set of complete and recover.
 *
 * @param {Promise} promise promise instance to wait for
 * @param {Function} complete function to be called on complete
 * @param {Function} recover function to be called on recover
 */
class PromiseTask extends Task {
  /**
   * PromiseTask constructor
   *
   * @param {Promise} promise promise instance to wait for
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   */
  constructor(promise, complete, recover) {
    super(undefined, complete, recover);

    this._promise = undefined;
    this._setPromise(promise);

    this._resolved = false;
  }

  /**
   * Runs a task
   *
   * Checks if promise already resolved. If not does nothing.
   *
   * @param {any} args any arguments
   */
  run(...args) {
    this._running = true;

    if (this._resolved) {
      this.complete();
    }
  }

  /**
   * Checks if instance is Promise
   *
   * @param {Promise} promise promise instance
   * @return {boolean}
   */
  _isPromise(promise) {
    return promise
      && promise.constructor && promise.constructor.name === 'Promise'
      && promise.finally && promise.finally.constructor.name === 'Function'
    ;
  }

  /**
   * Sets promise and attaches to finally
   *
   * @param {Promise} promise promise instance
   */
  _setPromise(promise) {
    if (this._isPromise(promise)) {
      this._promise = promise;

      this._promise.finally(() => this._promiseFinally());
    }
  }

  /**
   * Handles promise finally resolved
   */
  _promiseFinally() {
    this._resolved = true;

    if (this._running) {
      this.complete();
    }
  }
}

export default PromiseTask;
