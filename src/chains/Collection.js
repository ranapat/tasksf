import Task from '../tasks/Task';

class Collection {
  constructor(complete, recover) {
    this.tasks = [];

    this._running = false;

    this.__complete = new Task(undefined, complete, undefined);
    this.__recover = new Task(undefined, undefined, recover);
  }

  push(task) {
    this.tasks.push(task);

    return this;
  }

  unshift(task) {
    this.tasks.unshift(task);

    return this;
  }

  remove(task) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }

    return this;
  }

  run() {
    this._running = true;
  }

  _complete() {
    this._running = false;

    this.__complete.run();
  }

  _recover(error) {
    this._running = false;

    this.__recover.recover(error);
  }

  get running() {
    return this._running;
  }
}

export default Collection;
