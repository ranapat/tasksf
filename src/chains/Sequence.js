import Collection from './Collection';
import Injector from '../tasks/Injector';

class Sequence extends Collection {
  run() {
    super.run();

    this._next();
  }

  _next() {
    if (this.tasks.length > 0) {
      Injector.afterComplete(
        this.tasks.shift(),
        () => {
          this._next();
        }
      ).run();
    } else {
      this._complete();
    }
  }
}

export default Sequence;
