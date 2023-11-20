import { TelemetryDataRow } from '../TelemetryDataRow';
import { ITelemetryCorners, IWheelsData } from '../types';
import { TelemetryCorner } from './TelemetryCorner';

export class WheelsData implements IWheelsData {
  rotationSpeed: ITelemetryCorners<number>;
  onRumbleStrip: ITelemetryCorners<number>;
  inPuddleDepth: ITelemetryCorners<number>;
  surfaceRumble: ITelemetryCorners<number>;

  constructor(data: TelemetryDataRow) {
    this.rotationSpeed = new TelemetryCorner(data, 'wheelRotationSpeed');
    this.onRumbleStrip = new TelemetryCorner(data, 'wheelOnRumbleStrip');
    this.inPuddleDepth = new TelemetryCorner(data, 'wheelInPuddleDepth');
    this.surfaceRumble = new TelemetryCorner(data, 'surfaceRumble');
  }
}
