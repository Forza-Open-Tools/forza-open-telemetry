import { TelemetryDataRow } from '../TelemetryDataRow';
import { ISuspensionTravel, ITelemetryCorners } from '../types';
import { TelemetryCorner } from './TelemetryCorner';

export class SuspensionTravel implements ISuspensionTravel {
  normalized: ITelemetryCorners<number>;
  meters: ITelemetryCorners<number>;

  constructor(data: TelemetryDataRow) {
    this.normalized = new TelemetryCorner(data, 'normalizedSuspensionTravel');
    this.meters = new TelemetryCorner(data, 'suspensionTravelMeters');
  }
}
