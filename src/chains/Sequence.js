import Collection from './Collection';
import Injector from '../tasks/Injector';

/**
 * Sequence
 *
 * Executes tasks one by one
 *
 * @param {Function} complete function to be called on complete
 * @param {Function} recover function to be called on recover
 */
class Sequence extends Collection {
  /**
   * Sequence constructor
   *
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   */
  constructor(complete, recover) {
    super(complete, recover);

    this._current = undefined;
    this._passed = [];
    this._stopped = false;
  }

  /**
   * Runs all tasks in the collection
   */
  run() {
    super.run();

    this._stopped = false;
    if (this.current !== undefined) {
      this.unshift(this.current);
      this._current = undefined;
    }

    this._next();
  }

  /**
   * Stops all tasks in the collection
   *
   * @param {boolean} skip force the stopped task to be skipped
   * @return {boolean} stopped stopped status
   */
  stop(skip = false) {
    this._stopped = true;

    const current = this.current;
    if (current !== undefined) {
      if (skip === true) {
        this._current = undefined;
      }

      return current.stop() || this.tasks.length > 0;
    } else {
      return false;
    }
  }

  /**
   * Runs next in the sequence
   *
   * @protected
   */
  _next() {
    if (this._stopped) return;

    if (this.tasks.length > 0) {
      this.__next.run();
    } else {
      this._complete();
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
    this._current = undefined;

    super._complete();
  }

  /**
   * Recover
   *
   * Runs recover task
   *
   * @protected
   */
  _recover(error) {
    if (this._stopped) return;

    if (this.tasks.length > 0) {
      const task = this.__next;
      task.recover(error);
      if (!task.running && !task.done) {
        this._current = undefined;

        super._recover(error);
      }
    } else {
      this._complete();
    }
  }

  /**
   * Gets next task from the loop
   *
   * @return {Task} task next task
   * @protected
   */
  get __next() {
    this._current = this.tasks.length > 0 ? Injector.afterComplete(
      this.tasks.shift(),
      (error, ...args) => {
        Injector.resetAfterComplete(
          this._current, 'sequenceAfterComplete'
        );

        if (
          this._passed.length === 0
          || this._passed[this._passed.length - 1] !== this._current
        ) {
          this._passed.push(this._current);
        }

        if (error === undefined) {
          this._next();
        } else {
          this._recover(error);
        }
      },
      'sequenceAfterComplete'
    ) : undefined;

    return this._current;
  }

  /**
   * Gets the current task
   *
   * @return {Task} task current task
   */
  get current() {
    return this._current;
  }

  /**
   * Gets the passed task(s)
   *
   * @return {Array<Task>} task passed task(s)
   */
  get passed() {
    return this._passed;
  }
}

export default Sequence;
