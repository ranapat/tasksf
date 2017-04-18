import Task from './Task';

class TriggerTask extends Task {
  constructor(complete) {
    super(undefined, complete, undefined);
  }

  run(...args) {
    this._running = true;

    return 1;
  }
}

export default TriggerTask;
