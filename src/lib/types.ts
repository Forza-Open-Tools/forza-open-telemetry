export type TelemetryDataRow = (boolean | number)[];

export interface Rewind {
  lap: number;
  time: number;
}

export enum CarCorner {
  frontLeft = 'FrontLeft',
  frontRight = 'FrontRight',
  rearLeft = 'RearLeft',
  rearRight = 'RearRight'
}
