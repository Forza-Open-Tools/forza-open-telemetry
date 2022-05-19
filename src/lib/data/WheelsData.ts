import { TelemetryDataArrayWrapper } from 'forza-open-telemetry-server';
import { ITelemetryCorners } from '../types';
import { TelemetryCorner } from './TelemetryCorner';

export class WheelsData {
  rotationSpeed: ITelemetryCorners<number>;
  onRumbleStrip: ITelemetryCorners<number>;
  inPuddleDepth: ITelemetryCorners<number>;
  surfaceRumble: ITelemetryCorners<number>;

  constructor(data: TelemetryDataArrayWrapper) {
    this.rotationSpeed = new TelemetryCorner(data, 'wheelRotationSpeed');
    this.onRumbleStrip = new TelemetryCorner(data, 'wheelOnRumbleStrip');
    this.inPuddleDepth = new TelemetryCorner(data, 'wheelInPuddleDepth');
    this.surfaceRumble = new TelemetryCorner(data, 'surfaceRumble');
  }
}
