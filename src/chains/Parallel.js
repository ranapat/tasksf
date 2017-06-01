import Collection from './Collection';
import Injector from '../tasks/Injector';

/**
 * Parallel
 *
 * Executes tasks all at once
 *
 * @param {Function} complete function to be called on complete
 * @param {Function} recover function to be called on recover
 * @param {boolean} completeOnFirst completes on last or on first
 */
class Parallel extends Collection {
  /**
   * Parallel constructor
   *
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   * @param {boolean} completeOnFirst completes on last or on first
   */
  constructor(complete, recover, completeOnFirst) {
    super(complete, recover);

    this._current = [];
    this._passed = [];
    this._completeOnFirst = completeOnFirst === true;
  }

  /**
   * Runs all tasks in the collection
   */
  run() {
    super.run();

    while (this._runCondition) {
      this._run(this.tasks.shift());
    }
  }

  /**
   * Runs a single task
   *
   * @protected
   */
  _run(task) {
    Injector.afterComplete(
      task,
      (error, self, ...args) => {
        Injector.resetAfterComplete(
          self, 'parallelAfterComplete'
        );
        this._unchainTask(self);

        const index = this._current.indexOf(self);
        if (index !== -1) {
          this._current.splice(index, 1);
        }
        if (this._passed.indexOf(self) === -1) {
          this._passed.push(task);
        }

        if (this._completeOnFirst && this._passed.length === 1) {
          this._complete();
        } else if (!this._completeOnFirst && this._current.length === 0 && this.tasks.length === 0) {
          this._complete();
        }

        this._taskComplete();
      },
      'parallelAfterComplete'
    );

    this._current.push(task);
    task.run();
  }

  /**
   * Returns the run condition
   *
   * @return {boolean} condition run condition
   * @protected
   */
  get _runCondition() {
    return this.tasks.length > 0;
  }

  /**
   * Performs on every task complete
   *
   * @protected
   */
  _taskComplete() {
    //
  }

  /**
   * Stops all tasks in the collection
   *
   * @param {boolean} skip force the stopped task to be skipped
   * @return {boolean} stopped stopped status
   */
  stop(skip = false) {
    this._running = false;

    let result = true;

    this._current.forEach((item) => {
      result = result || item.stop();

      if (skip) {
          Injector.resetAfterComplete(
            item, 'parallelAfterComplete'
          );
          this._unchainTask(item);
      }
    });

    if (skip) {
      this._current = [];
    } else {
      while (this._current.length > 0) {
        this.tasks.push(this._current.shift());
      }
    }

    return result;
  }

  /**
   * Resets a stopped collection
   *
   * @return {boolean} reset reset status
   */
  reset() {
    if (super.reset()) {
      this._passed = [];

      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets the current tasks
   *
   * @return {Array<Task>} task current tasks
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

export default Parallel;
