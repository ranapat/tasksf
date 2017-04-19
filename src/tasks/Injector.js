class Injector {
  static afterComplete(task, callback) {
    const current = task._complete;
    task._complete = (self, ...args) => {
      let error;
      try {
        if (current !== undefined) {
          current(self, ...args);
        }
      } catch (e) {
        error = e;
      }
      callback(error, ...args);
    };
    return task;
  }
}

export default Injector;
