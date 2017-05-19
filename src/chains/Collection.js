import Task from '../tasks/Task';
import Factory from '../factory/Factory';
import Injector from '../tasks/Injector';

/**
 * Collection. Internal class
 *
 * Basic collection class
 *
 * @param {Function} complete function to be called on complete
 * @param {Function} recover function to be called on recover
 */
class Collection {
  /**
   * Task constructor
   *
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   */
  constructor(complete, recover) {
    this.tasks = [];

    this._running = false;

    this._attached = {};

    this.__complete = new Task(undefined, complete, undefined);
    this.__recover = new Task(undefined, undefined, recover);

    this.__complete.attach(Factory._CHAIN_, this);
    this.__recover.attach(Factory._CHAIN_, this);
  }

  /**
   * Attaches variable with a key
   *
   * Used to avoid using global variables or trying to scope
   * in some way. After attach() you can get().
   * Attach will also keep the variable from GC.
   *
   * @param {string} key accessor for the variable
   * @param {any} value variable value
   */
  attach(key, value) {
    this._attached[key] = value;
  }

  /**
   * Detaches variable with a key
   *
   * @param {string} key accessor for the variable
   */
  detach(key) {
    delete this._attached[key];
  }

  /**
   * Gets variable with a key
   *
   * @param {string} key accessor for the variable
   * @return {any} value variable value
   */
  get(key) {
    return this._attached[key];
  }

  /**
   * Pushes task to the collection
   *
   * @param {Task} task task to push
   * @return {Collection} collection current collection
   */
  push(task) {
    task.attach(Factory._CHAIN_, this);
    Injector.addChainGetter(task);
    this.tasks.push(task);

    return this;
  }

  /**
   * Unshifts task to the collection
   *
   * @param {Task} task task to push
   * @return {Collection} collection current collection
   */
  unshift(task) {
    task.attach(Factory._CHAIN_, this);
    Injector.addChainGetter(task);
    this.tasks.unshift(task);

    return this;
  }

  /**
   * Removes task from the collection
   *
   * @param {Task} task task to push
   * @return {Collection} collection current collection
   */
  remove(task) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      Injector.removeChainGetter(task);
      task.detach(Factory._CHAIN_);
      this.tasks.splice(index, 1);
    }

    return this;
  }

  /**
   * Runs all tasks in the collection
   */
  run() {
    this._running = true;
  }

  /**
   * Stops all tasks in the collection
   *
   * @return {boolean} stopped stopped status
   */
  stop() {
    return false;
  }

  /**
   * Complete
   *
   * Runs complete task
   *
   * @protected
   */
  _complete() {
    this._running = false;

    this.__complete.run();
  }

  /**
   * Recover
   *
   * Runs recover task
   *
   * @protected
   */
  _recover(error) {
    this._running = false;

    this.__recover.recover(error);
  }

  /**
   * Gets the running status
   *
   * @return {boolean} running running status
   */
  get running() {
    return this._running;
  }

  /**
   * Gets the current task
   *
   * @return {Task} task current task
   */
  get current() {
    return undefined;
  }
}

export default Collection;
