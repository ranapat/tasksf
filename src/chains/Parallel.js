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
      Injector.afterComplete(
        this.tasks.shift(),
        (error, self, ...args) => {
          Injector.resetAfterComplete(
            self, 'parallelAfterComplete'
          );
          this._unchainTask(self);

          if (this._completeOnFirst && completed === 0) {
            this._complete();
          } else if (!this._completeOnFirst && completed + 1 === length) {
            this._complete();
          }

          ++completed;
        },
        'parallelAfterComplete'
      ).run();
    }
  }

}

export default Parallel;
