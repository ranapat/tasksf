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

    let completed = 0;
    const length = this.tasks.length;

    while (this.tasks.length > 0) {
      const task = Injector.afterComplete(
        this.tasks.shift(),
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

          if (this._completeOnFirst && completed === 0) {
            this._complete();
          } else if (!this._completeOnFirst && completed + 1 === length) {
            this._complete();
          }

          ++completed;
        },
        'parallelAfterComplete'
      );

      this._current.push(task);
      task.run();
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
