class Promise {
  constructor() {
    this._callbacks = [];
  }

  finally(callback) {
    this._callbacks.push(callback);
  }

  resolve() {
    this._callbacks.forEach((callback) => {
      callback();
    });
  }
}

export default Promise;
