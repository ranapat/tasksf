/**
 * Match for a Map
 *
 * Match contains the instance of the Task and a
 * percentage from 0 to 1. In cases of overlapping
 * of Matches the one with bigger percentage will be
 * used
 *
 * @param {Task} instance any Task instance
 * @param {number} percentage from 0 to 1
 */
class Match {
  /**
   * Match constructor
   *
   * @param {Task} instance any Task instance
   * @param {number} percentage from 0 to 1
   */
  constructor(instance, percentage) {
    this._percentage = 0.5;
    this.instance = instance;

    this.percentage = percentage;
  }

  /**
   * Percentage setter
   *
   * @param {number} value from 0 to 1
   */
  set percentage(value) {
    if (value !== undefined && value !== null && value !== false) {
      this._percentage = value > 1 ? 1 : value < 0 ? 0 : value;
    }
  }

  /**
   * Percentage getter
   *
   * @return {number} percentage value from 0 to 1
   */
  get percentage() {
    return this._percentage;
  }
}

export default Match;
