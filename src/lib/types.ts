
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
