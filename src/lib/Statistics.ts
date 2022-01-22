export default class Statistics {
  private _min = 0;
  private _max = 0;
  private _avg = 0;
  private _total = 0;
  private _count = 0;

  get min(): number { return this._min }
  get max(): number { return this._max }

  get avg(): number {
    if (this._avg === 0 && this._count > 0) {
      this._avg = this._total / this._count;
    }
    return this._avg;
  }

  add(value: number): void {
    this._avg = 0;
    this._total += value;
    this._count += 1;
    if (value < this._min) this._min = value;
    else if (value > this._max) this._max = value;
  }
}
