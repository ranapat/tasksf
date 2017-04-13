import Task from './Task';

class TimeoutTask extends Task {
  constructor(timeout, run, complete, recover) {
    super(run, complete, recover);

    this._timeout = timeout;
  }

  run(...args) {
    this._running = true;

    setTimeout(() => super.run(...args), this._timeout);
  }
}

export default TimeoutTask;
