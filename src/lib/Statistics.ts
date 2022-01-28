export default class Statistics {
  min = 0;
  max = 0;
  private _avg = 0;
  private _total = 0;
  private _count = 0;
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
    if (this.min === 0 || value < this.min) this.min = value;
    else if (this.max === 0 || value > this.max) this.max = value;
  }
}
