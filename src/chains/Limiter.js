import Parallel from './Parallel';

/**
 * Limiter
 *
 * Parallel with limit for max running tasks
 *
 * @param {number} limit max running tasks
 * @param {Function} complete function to be called on complete
 * @param {Function} recover function to be called on recover
 * @param {boolean} completeOnFirst completes on last or on first
 */
class Limiter extends Parallel {
  /**
   * Limiter constructor
   *
   * @param {number} limit max running tasks
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   * @param {boolean} completeOnFirst completes on last or on first
   */
  constructor(limit, complete, recover, completeOnFirst) {
    super(complete, recover, completeOnFirst);

    this._limit = Number.isInteger(limit) ? limit : 1;
  }

  /**
   * Returns the run condition
   *
   * @return {boolean} condition run condition
   * @protected
   */
  get _runCondition() {
    return this.tasks.length > 0 && this._current.length < this._limit;
  }

  /**
   * Performs on every task complete
   *
   * @protected
   */
  _taskComplete() {
    if (this.tasks.length > 0) {
      this._run(this.tasks.shift());
    }
  }

}

export default Limiter;
