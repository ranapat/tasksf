class Injector {
  static afterComplete(task, callback) {
    const current = task._complete;
    task._complete = (self, ...args) => {
      current(self, ...args);
      callback(self, ...args);
    };
    return task;
  }
}

export default Injector;
