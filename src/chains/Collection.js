import Task from '../tasks/Task';
import Factory from '../factory/Factory';
import Injector from '../tasks/Injector';

/**
 * Collection. Abstract class.
 *
 * Basic collection class. Do NOT instantiate directly.
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

    this._autoRun = false;
    this._running = false;

    this._attached = {};

    this.__complete = new Task(undefined, complete, undefined);
    this.__recover = new Task(undefined, undefined, recover);

    this.__complete.attach(Factory._CHAIN_, this);
    this.__recover.attach(Factory._CHAIN_, this);

    Injector.addChainGetter(this.__complete);
    Injector.addChainGetter(this.__recover);
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
   * @return {Collection} collection current collection
   */
  attach(key, value) {
    this._attached[key] = value;

    return this;
  }

  /**
   * Detaches variable with a key
   *
   * @param {string} key accessor for the variable
   * @return {Collection} collection current collection
   */
  detach(key) {
    delete this._attached[key];

    return this;
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
    this._chainTask(task);
    this.tasks.push(task);

    this._postTaskAdds();

    return this;
  }

  /**
   * Unshifts task to the collection
   *
   * @param {Task} task task to push
   * @return {Collection} collection current collection
   */
  unshift(task) {
    this._chainTask(task);
    this.tasks.unshift(task);

    this._postTaskAdds();

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
      this._unchainTask(task);
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
   * Resets a stopped collection
   *
   * @return {boolean} reset reset status
   */
  reset() {
    if (!this._running) {
      this._attached = {};
      while (this.tasks.length > 0) {
        this.remove(this.tasks[0]);
      }

      return true;
    } else {
      return false;
    }
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
   * Chain task
   *
   * Attach the chain to the task
   *
   * @param {Task} task task to chain
   *
   * @protected
   */
  _chainTask(task) {
    task.attach(Factory._CHAIN_, this);
    Injector.addChainGetter(task);
  }

  /**
   * Unchain task
   *
   * Detach the chain from the task
   *
   * @param {Task} task task to chain
   *
   * @protected
   */
  _unchainTask(task) {
    Injector.removeChainGetter(task);
    task.detach(Factory._CHAIN_);
  }

  /**
   * Probe post add actions
   *
   * Try all post add triggers
   *
   * @protected
   */
  _postTaskAdds() {
    if (this.autoRun) {
      this.run();
    }
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
   * Gets the current task(s)
   *
   * @return {Task|Array<Task>} task current task(s)
   */
  get current() {
    return undefined;
  }

  /**
   * Gets the passed task(s)
   *
   * @return {Array<Task>} task passed task(s)
   */
  get passed() {
    return undefined;
  }

  /**
   * Sets autoRun
   *
   * Will autorun on push or unshift

   * @param {boolean} autoRun auto runs on push or unshift
   */
  set autoRun(value) {
    this._autoRun = value;
  }

  /**
   * Gets autoRun
   *
   * @return {boolean} autoStart auto start on push or unshift
   */
  get autoRun() {
    return this._autoRun;
  }
}

export default Collection;
