import { TelemetryDataArrayWrapper } from 'forza-open-telemetry-server';
import { ITelemetryCorners } from '../types';
import { TelemetryCorner } from './TelemetryCorner';

export class SuspensionTravel {
  normalized: ITelemetryCorners<number>;
  meters: ITelemetryCorners<number>;

  constructor(data: TelemetryDataArrayWrapper) {
    this.normalized = new TelemetryCorner(data, 'normalizedSuspensionTravel');
    this.meters = new TelemetryCorner(data, 'suspensionTravelMeters');
  }
}
