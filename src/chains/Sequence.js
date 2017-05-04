import Collection from './Collection';
import Injector from '../tasks/Injector';

class Sequence extends Collection {
  constructor(complete, recover) {
    super(complete, recover);

    this._current = undefined;
    this._stopped = false;
  }

  run() {
    super.run();

    this._stopped = false;

    this._next();
  }

  stop() {
    this._stopped = true;
    if (this.current !== undefined) {
      return this.current.stop() || this.tasks.length > 0;
    } else {
      return false;
    }
  }

  _next() {
    if (this._stopped) return;

    if (this.tasks.length > 0) {
      this.__next.run();
    } else {
      this._complete();
    }
  }

  _complete() {
    this._current = undefined;

    super._complete();
  }

  _recover(error) {
    if (this._stopped) return;

    if (this.tasks.length > 0) {
      const task = this.__next;
      task.recover(error);
      if (!task.running && !task.done) {
        this._current = undefined;

        super._recover(error);
      }
    } else {
      this._complete();
    }
  }

  get __next() {
    this._current = this.tasks.length > 0 ? Injector.afterComplete(
      this.tasks.shift(),
      (error, ...args) => {
        if (error === undefined) {
          this._next();
        } else {
          this._recover(error);
        }
      }
    ) : undefined;

    return this._current;
  }

  get current() {
    return this._current;
  }
}

export default Sequence;
