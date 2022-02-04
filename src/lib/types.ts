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
