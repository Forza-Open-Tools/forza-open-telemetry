import { TelemetryDataPoint } from './data';

export type TelemetryCornerPrefix =
  | 'normalizedSuspensionTravel'
  | 'tireSlipRatio'
  | 'wheelRotationSpeed'
  | 'wheelOnRumbleStrip'
  | 'wheelInPuddleDepth'
  | 'surfaceRumble'
  | 'tireSlipAngle'
  | 'tireCombinedSlip'
  | 'suspensionTravelMeters'
  | 'tireTemp';

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

export interface ITelemetryValuePair<T> {
  left: T;
  right: T;
}

export interface ITelemetryCorners<T> {
  front: ITelemetryValuePair<T>;
  rear: ITelemetryValuePair<T>;
  getCornerValue(corner: CarCorner): T;
}

export interface IDimensionalValue<T> {
  x: T;
  y: T;
  z: T;
}

export interface IWheelsData {
  rotationSpeed: ITelemetryCorners<number>;
  onRumbleStrip: ITelemetryCorners<number>;
  inPuddleDepth: ITelemetryCorners<number>;
  surfaceRumble: ITelemetryCorners<number>;
}

export interface ITiresData {
  slipRatio: ITelemetryCorners<number>;
  slipAngle: ITelemetryCorners<number>;
  combinedSlip: ITelemetryCorners<number>;
  temp: ITelemetryCorners<number>;
}

export interface ISuspensionTravel {
  normalized: ITelemetryCorners<number>;
  meters: ITelemetryCorners<number>;
}

export interface ICarControls {
  accelerator: number;
  brake: number;
  clutch: number;
  handbrake: number;
  gear: number;
  steer: number;
}

export interface ICar {
  make: string;
  model: string;
  ordinal: number;
  class: number;
  pi: number;
  drivetrain: number;
  cylinders: number;
  category: number;
  engineMaxRpm: number;
  engineIdleRpm: number;
}

export interface ICarMovement {
  acceleration: IDimensionalValue<number>;
  velocity: IDimensionalValue<number>;
  angularVelocity: IDimensionalValue<number>;
  yaw: number;
  pitch: number;
  roll: number;
}

export interface ICarEngine {
  rpm: number;
  speed: number;
  power: number;
  torque: number;
  boost: number;
  fuel: number;
}

export interface ITelemetryDataPoint {
  epochMs: number;
  timestampMS: number;
  lapTime: number;
  raceTime: number;
  racePosition: number;
  lap: number;
  distance: number;

  engine: ICarEngine;
  controls: ICarControls;
  movement: ICarMovement;
  position: IDimensionalValue<number>;
  suspensionTravel: ISuspensionTravel;
  wheels: IWheelsData;
  tires: ITiresData;
}

export interface IStatistics {
  min: number;
  max: number;
  avg: number;
}

export interface ILapStatistics {
  normalizedSuspensionTravel: ITelemetryCorners<IStatistics>;
  tireTemp: ITelemetryCorners<IStatistics>;
  speed: IStatistics;
  position: IDimensionalValue<IStatistics>
}

export interface ITelemetryLap {
  lap: number;
  time: number;
  telemetry: ITelemetryDataPoint[];
  stats: ILapStatistics;
}

export interface IRaceCar {
  ordinal: number;
  carClassId: number;
  carClass: string;
  pi: number;
  drivetrainTypeId: number;
  cylinders: number;
  maxRpm: number;
  categoryId: number;
  make: string;
  model: string;
}

export interface IRace {
  laps: ITelemetryLap[];
  startTs: number;
  endTs: number;
  car: IRaceCar;
}
