import Sequence from './Sequence';

/**
 * Loop
 *
 * Recurrent tasks
 *
 * @param {number} repeats number of repeats. 0 for infinite
 * @param {Function} repeat function to be called on repeat
 * @param {Function} recover function to be called on recover
 */
class Loop extends Sequence {
  /**
   * Loop constructor
   *
   * @param {number} repeats number of repeats. 0 for infinite
   * @param {Function} repeat function to be called on repeat
   * @param {Function} recover function to be called on recover
   */
  constructor(repeats, repeat, recover) {
    super(repeat, recover);

    this._repeats = repeats === undefined ? 0 : repeats;
    this._repeat = 0;
    this._looped = [];
  }

  /**
   * Complete
   *
   * Runs complete task
   *
   * @protected
   */
  _complete() {
    super._complete();

    if (!this._stopped) {
      if (this._repeats === 0 || ++this._repeat < this._repeats) {
        while (this._looped.length > 0) {
          this.tasks.push(this._looped.shift());

          this._chainTask(this.tasks[this.tasks.length - 1]);
        }

        setTimeout(() => this.run(), 0);
      }
    }
  }

  /**
   * Gets next task from the loop
   *
   * @return {Task} task next task
   * @protected
   */
  get __next() {
    const current = super.__next;

    if (
      this._looped.length === 0
      || this._looped[this._looped.length - 1] !== current
    ) {
      this._looped.push(current);
    }

    return current;
  }

  /**
   * Gets the passed task(s)
   *
   * @return {Array<Task>} task passed task(s)
   */
  get passed() {
    return undefined;
  }
}

export default Loop;
