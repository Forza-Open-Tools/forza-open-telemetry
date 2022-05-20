import { TelemetryDataArrayWrapper } from './TelemetryDataArrayWrapper';
import { ISuspensionTravel, ITelemetryCorners } from '../types';
import { TelemetryCorner } from './TelemetryCorner';

export class SuspensionTravel implements ISuspensionTravel {
  normalized: ITelemetryCorners<number>;
  meters: ITelemetryCorners<number>;

  constructor(data: TelemetryDataArrayWrapper) {
    this.normalized = new TelemetryCorner(data, 'normalizedSuspensionTravel');
    this.meters = new TelemetryCorner(data, 'suspensionTravelMeters');
  }
}
