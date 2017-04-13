class Match {
  constructor(instance, percentage) {
    this._percentage = 0.5;
    this.instance = instance;

    this.percentage = percentage;
  }

  set percentage(value) {
    this._percentage = value > 1 ? 1 : value < 0 ? 0 : value;
  }

  get percentage() {
    return this._percentage;
  }
}

export default Match;
