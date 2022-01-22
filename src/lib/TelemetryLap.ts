import { TelemetryRow } from 'forza-open-telemetry-server';
import LapStatistics from './LapStatistics';

export default class TelemetryLap {
  private _lap = 0;
  private _time = 0;
  telemetry: TelemetryRow[] = [];
  stats: LapStatistics = new LapStatistics();

  constructor(lap: number) {
    this._lap = lap + 1;
  }

  get lap() { return this._lap; }
  get time() { return this._time; }

  add(row: TelemetryRow) {
    this.telemetry.push(row);
    this.stats.add(row);
    this._time = row.currentLapTime;
  }

  updateTime(time: number) {
    this._time = time;
  }
}
