import { TelemetryRow } from 'forza-open-telemetry-server';

export type TelemetryDataRow = (boolean | number)[];

export interface Rewind {
  lap: number;
  time: number;
}

export interface LapColorClasses {
  bg: string;
  stroke: string;
}

export interface TelemetryIssue {
  position: {
    x: number;
    y: number;
  };

}

export enum CarCorner {
  frontLeft = 'FrontLeft',
  frontRight = 'FrontRight',
  rearLeft = 'RearLeft',
  rearRight = 'RearRight'
}

export interface IStatistics {
  min: number;
  max: number;
  avg: number;
  add(value: number): void;
}

export interface ILapStatistics {
  normalizedSuspensionTravelFrontLeft: IStatistics;
  normalizedSuspensionTravelFrontRight: IStatistics;
  normalizedSuspensionTravelRearLeft: IStatistics;
  normalizedSuspensionTravelRearRight: IStatistics;
  tireSlipRatioFrontLeft: IStatistics;
  tireSlipRatioFrontRight: IStatistics;
  tireSlipRatioRearLeft: IStatistics;
  tireSlipRatioRearRight: IStatistics;
  wheelRotationSpeedFrontLeft: IStatistics;
  wheelRotationSpeedFrontRight: IStatistics;
  wheelRotationSpeedRearLeft: IStatistics;
  wheelRotationSpeedRearRight: IStatistics;
  tireSlipAngleFrontLeft: IStatistics;
  tireSlipAngleFrontRight: IStatistics;
  tireSlipAngleRearLeft: IStatistics;
  tireSlipAngleRearRight: IStatistics;
  tireCombinedSlipFrontLeft: IStatistics;
  tireCombinedSlipFrontRight: IStatistics;
  tireCombinedSlipRearLeft: IStatistics;
  tireCombinedSlipRearRight: IStatistics;
  tireTempFrontLeft: IStatistics;
  tireTempFrontRight: IStatistics;
  tireTempRearLeft: IStatistics;
  tireTempRearRight: IStatistics;
  speed: IStatistics;
  positionX: IStatistics;
  positionZ: IStatistics;
  add(row: TelemetryRow): void;
}

export interface ITelemetryLap {
  lap: number;
  time: number;
  telemetry: TelemetryRow[];
  issues: TelemetryRow[];
  stats: ILapStatistics;
  colorClasses: LapColorClasses;
  add(row: TelemetryRow): void;
}
