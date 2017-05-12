/**
 * Task
 *
 * Basic task with run, complete and recover
 *
 * @param {Function} run function to be called on run
 * @param {Function} complete function to be called on complete
 * @param {Function} recover function to be called on recover
 */
class Task {
  /**
   * Task constructor
   *
   * @param {Function} run function to be called on run
   * @param {Function} complete function to be called on complete
   * @param {Function} recover function to be called on recover
   */
  constructor(run, complete, recover) {
    this._run = run;
    this._complete = complete;
    this._recover = recover;

    this._running = false;
    this._done = false;

    this._attached = {};

    this._exceptions = {
      run: undefined,
      complete: undefined,
      recover: undefined
    };
  }

  /**
   * Attaches variable to the task
   *
   * @param {string} key accessor for the variable
   * @param {any} value variable value
   */
  attach(key, value) {
    this._attached[key] = value;
  }

  /**
   * Detaches variable by name
   *
   * @param {string} key accessor for the variable
   */
  detach(key) {
    delete this._attached[key];
  }

  /**
   * Gets variable by name
   *
   * @param {string} key accessor for the variable
   * @return {any} variable value
   */
  get(key) {
    return this._attached[key];
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
        if (this._run(this, ...args) === undefined) {
          this.complete();
        }
      } catch (error) {
        this._exceptions.run = error;

        this.complete(error);
      }
    } else {
      this.complete();
    }
  }

  /**
   * Completes a task
   *
   * Executes the complete function if defined. All arguments will be
   * passed to it.
   *
   * @param {any} args any arguments
   */
  complete(...args) {
    this._running = false;
    this._done = true;

    if (this._complete !== undefined) {
      try {
        this._complete(this, ...args);
      } catch (error) {
        this._exceptions.complete = error;
      }
    }
  }

  /**
   * Recovers a task
   *
   * Executes the recover function if defined. All arguments will be
   * passed to it.
   *
   * @param {any} args any arguments
   */
  recover(...args) {
    if (this._recover !== undefined) {
      try {
        const recovered = this._recover(this, ...args);
        if (recovered !== undefined) {
          this.run(recovered);
        }
      } catch (error) {
        this._exceptions.recover = error;
      }
    }
  }

  /**
   * Stops a task
   *
   * @return {boolean} success
   */
  stop() {
    return false;
  }

  /**
   * Gets the running status
   *
   * @return {boolean} running
   */
  get running() {
    return this._running;
  }

  /**
   * Gets the done status
   *
   * @return {boolean} done
   */
  get done() {
    return this._done;
  }

  /**
   * Gets the failed status
   *
   * @return {boolean} failed
   */
  get failed() {
    return this._exceptions.run !== undefined
      || this._exceptions.complete !== undefined
      || this._exceptions.recover !== undefined
    ;
  }

  /**
   * Gets the exceptions if any
   *
   * @return {Object} exceptions
   */
  get exceptions() {
    return this._exceptions;
  }
}

export default Task;
