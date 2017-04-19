import Task from '../tasks/Task';

class Collection {
  constructor(complete) {
    this.tasks = [];

    this._running = false;

    this.__complete = new Task(undefined, complete, undefined);
  }

  push(task) {
    this.tasks.push(task);
  }

  unshift(task) {
    this.tasks.unshift(task);
  }

  remove(task) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  run() {
    this._running = true;
  }

  _complete() {
    this._running = false;

    this.__complete.run();
  }

  get running() {
    return this._running;
  }
}

export default Collection;
