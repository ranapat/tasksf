import Task from './Task';

/**
 * TriggerTask
 *
 * Trigger task with complete.
 * Executes run and does not complete automatically.
 * Need manual call of complete() method.
 * Useful for triggers.
 *
 * @param {Function} complete function to be called on complete
 */
class TriggerTask extends Task {
  /**
   * TriggerTask constructor
   *
   * @param {Function} complete function to be called on complete
   */
  constructor(complete) {
    super(undefined, complete, undefined);
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

    return 1;
  }
}

export default TriggerTask;
