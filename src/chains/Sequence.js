import Collection from './Collection';

class Sequence extends Collection {
  run() {
    super.run();

    this._next();
  }

  _next() {
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();

      this._injectTaskAfterComplete(task, () => { this._next() });

      task.run();
    } else {
      this._complete();
    }
  }
}

export default Sequence;
