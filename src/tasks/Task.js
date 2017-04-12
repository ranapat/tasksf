class Task {
  constructor(run, complete, recover) {
    this._run = run;
    this._complete = complete;
    this._recover = recover;

    this._done = false;
  }

  run(...args) {
    if (this._run !== undefined) {
      if (this._run(this, ...args) === undefined) {
        this.complete();
      }
    } else {
      this.complete();
    }
  }

  complete(...args) {
    this._done = true;

    if (this._complete !== undefined) {
      this._complete(this, ...args);
    }
  }

  recover(...args) {
    if (this._recover !== undefined) {
      const recovered = this._recover(this, ...args);
      if (recovered !== undefined) {
        this.run(recovered);
      }
    }
  }

  get done() {
    return this._done;
  }
}

export default Task;
