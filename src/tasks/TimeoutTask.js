import Task from './Task';

class TimeoutTask extends Task {
  constructor(timeout, run, complete, recover) {
    super(run, complete, recover);

    this._timeout = timeout;
    this._index = undefined;
  }

  run(...args) {
    this._running = true;

    this._index = setTimeout(() => super.run(...args), this._timeout);
  }

  stop() {
    if (this._running) {
      clearTimeout(this._index);

      return true;
    } else {
      return false;
    }
  }
}

export default TimeoutTask;
