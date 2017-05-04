import Task from '../tasks/Task';
import Factory from '../factory/Factory';

class Collection {
  constructor(complete, recover) {
    this.tasks = [];

    this._running = false;

    this._attached = {};

    this.__complete = new Task(undefined, complete, undefined);
    this.__recover = new Task(undefined, undefined, recover);

    this.__complete.attach(Factory._CHAIN_, this);
    this.__recover.attach(Factory._CHAIN_, this);
  }

  attach(key, value) {
    this._attached[key] = value;
  }

  detach(key) {
    delete this._attached[key];
  }

  get(key) {
    return this._attached[key];
  }

  push(task) {
    task.attach(Factory._CHAIN_, this);
    this.tasks.push(task);

    return this;
  }

  unshift(task) {
    task.attach(Factory._CHAIN_, this);
    this.tasks.unshift(task);

    return this;
  }

  remove(task) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      task.detach(Factory._CHAIN_);
      this.tasks.splice(index, 1);
    }

    return this;
  }

  run() {
    this._running = true;
  }

  stop() {
    return false;
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

  get current() {
    return undefined;
  }
}

export default Collection;
