import Task from './Task';

/**
 * AsyncTask
 *
 * Executes run and does not complete automatically.
 * Need manual call of complete() method.
 * Useful for triggers.
 *
 * Similar with TriggerTask, but with full set of run, complete and recover.
 * In run method first parameter will be complete callback, second self and
 * ...args to follow. Does not care what run returns.
 *
 * @example run = (complete, self, ...args) => { }
 *
 * @param {Function} run function to be called on run
 * @param {Function} complete function to be called on complete
 * @param {Function} recover function to be called on recover
 */
class AsyncTask extends Task {
  /**
   * AsyncTask constructor
   *
   * @param {Function} run function to be called on run
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   */
  constructor(run, complete, recover) {
    super(run, complete, recover);
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

    if (this._run !== undefined) {
      try {
        this._run(this.complete.bind(this), this, ...args);
      } catch (error) {
        this._exceptions.run = error;
      }
    }
  }
}

export default AsyncTask;
