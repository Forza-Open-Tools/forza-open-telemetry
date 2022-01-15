export interface TelemetryLap {
  lap: number;
  time: number;
  telemetry: TelemetryRow[];
}

export interface Rewind {
  lap: number;
  time: number;
}
