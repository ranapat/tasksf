class Task {
  constructor(run, complete, recover) {
    this._run = run;
    this._complete = complete;
    this._recover = recover;

    this._running = false;
    this._done = false;

    this._exceptions = {
      run: undefined,
      complete: undefined,
      recover: undefined
    };
  }

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

  complete(...args) {
    this._running = false;
    this._done = true;

    try {
      if (this._complete !== undefined) {
        this._complete(this, ...args);
      }
    } catch (error) {
      this._exceptions.complete = error;
    }
  }

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

  get running() {
    return this._running;
  }

  get done() {
    return this._done;
  }

  get failed() {
    return this._exceptions.run !== undefined
      || this._exceptions.complete !== undefined
      || this._exceptions.recover !== undefined
    ;
  }

  get exceptions() {
    return this._exceptions;
  }
}

export default Task;
