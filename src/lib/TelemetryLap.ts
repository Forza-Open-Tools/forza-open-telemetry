import { TelemetryRow } from 'forza-open-telemetry-server';
import LapStatistics from './LapStatistics';

export default class TelemetryLap {
  lap = 0;
  time = 0;
  telemetry: TelemetryRow[] = [];
  stats: LapStatistics = new LapStatistics();

  constructor(lap: number) {
    this.lap = lap;
  }

  add(row: TelemetryRow) {
    this.telemetry.push(row);
    this.stats.add(row);
    this.time = row.currentLapTime;
  }

  updateTime(time: number) {
    this.time = time;
  }
}
