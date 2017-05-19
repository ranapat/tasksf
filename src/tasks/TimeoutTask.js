import Task from './Task';

/**
 * TimeoutTask
 *
 * Timeout task with run, complete and recover.
 * Executes after initial timeout
 *
 * @param {number} timeout wait before run
 * @param {Function} run function to be called on run
 * @param {Function} complete function to be called on complete
 * @param {Function} recover function to be called on recover
 */
class TimeoutTask extends Task {
  /**
   * TimeoutTask constructor
   *
   * @param {number} timeout wait before run
   * @param {Function} run function to be called on run
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   */
  constructor(timeout, run, complete, recover) {
    super(run, complete, recover);

    this._timeout = timeout;
    this._index = undefined;
  }

  /**
   * Runs a task
   *
   * Executes the run function if defined. All arguments will be
   * passed to it.
   *
   * @param {any} args any arguments
   */
  run(...args) {
    this._running = true;

    this._index = setTimeout(() => super.run(...args), this._timeout);
  }

  /**
   * Stops a task
   *
   * @return {boolean} success
   */
  stop() {
    if (this._running) {
      clearTimeout(this._index);

      return true;
    } else {
      return false;
    }
  }
}

export default TimeoutTask;
