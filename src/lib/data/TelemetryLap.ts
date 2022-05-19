import { TelemetryDataArray, TelemetryDataArrayWrapper } from 'forza-open-telemetry-server';
import { LapStatistics } from './LapStatistics';
import { TelemetryDataPoint } from './TelemetryDataPoint';

export class TelemetryLap {
  lap = 0;
  time = 0;
  telemetry: TelemetryDataPoint[] = [];
  issues: TelemetryDataPoint[] = [];
  stats: LapStatistics = new LapStatistics();

  constructor(lap: number) {
    this.lap = lap;
  }

  add(data: TelemetryDataArrayWrapper) {
    const point = new TelemetryDataPoint(data);
    this.telemetry.push(point);
    this.stats.add(point);
    this.time = point.lapTime;
  }

  // private checkSuspension(row: TelemetryDataArray): boolean {
  //   return getCornerValues(row, 'normalizedSuspensionTravel')
  //     .some((value) => value < 0.2 || value > 0.8);
  // }

  // private checkSlip(row: TelemetryDataArray): boolean {
  //   return getCornerValues(row, 'tireCombinedSlip')
  //     .some((value) => value >= 1)
  // }

  // private checkTireTemp(row: TelemetryDataArray): boolean {
  //   return getCornerValues(row, 'tireTemp')
  //     .some((value) => value > 130);
  // }

  updateTime(time: number) {
    this.time = time;
  }
}
