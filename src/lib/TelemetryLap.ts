import { TelemetryRow } from 'forza-open-telemetry-server';
import getLapColorClass from './lapColors';
import LapStatistics from './LapStatistics';
import { CarCorner, LapColorClasses } from './types';

const corners = [
  CarCorner.frontLeft,
  CarCorner.frontRight,
  CarCorner.rearLeft,
  CarCorner.rearRight,
];

type CornerKey = 'normalizedSuspensionTravel' |
  'tireSlipRatio' |
  'wheelRotationSpeed' |
  'wheelOnRumbleStrip' |
  'wheelInPuddleDepth' |
  'surfaceRumble' |
  'tireSlipAngle' |
  'tireCombinedSlip' |
  'suspensionTravelMeters' |
  'tireTemp';

function getCornerValues(row: TelemetryRow, key: CornerKey): number[] {
  return corners.map((c) => row[`${key}${c}`]);
}

export default class TelemetryLap {
  lap = 0;
  time = 0;
  telemetry: TelemetryRow[] = [];
  issues: TelemetryRow[] = [];
  stats: LapStatistics = new LapStatistics();
  colorClasses: LapColorClasses;

  constructor(lap: number) {
    this.lap = lap;
    this.colorClasses = getLapColorClass(lap);
  }

  add(row: TelemetryRow) {
    this.telemetry.push(row);
    this.stats.add(row);
    this.time = row.currentLapTime;

    // if (this.checkSuspension(row) || this.checkSlip(row) || this.checkTireTemp(row)) {
    //   this.issues.push(row);
    // }
  }

  private checkSuspension(row: TelemetryRow): boolean {
    return getCornerValues(row, 'normalizedSuspensionTravel')
      .some((value) => value < 0.2 || value > 0.8);
  }

  private checkSlip(row: TelemetryRow): boolean {
    return getCornerValues(row, 'tireCombinedSlip')
      .some((value) => value >= 1)
  }

  private checkTireTemp(row: TelemetryRow): boolean {
    return getCornerValues(row, 'tireTemp')
      .some((value) => value > 130);
  }

  updateTime(time: number) {
    this.time = time;
  }
}
