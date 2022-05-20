import { TelemetryDataArrayWrapper } from './TelemetryDataArrayWrapper';
import { ITelemetryCorners, ITiresData } from '../types';
import { TelemetryCorner } from './TelemetryCorner';

export class TiresData implements ITiresData {
  slipRatio: ITelemetryCorners<number>;
  slipAngle: ITelemetryCorners<number>;
  combinedSlip: ITelemetryCorners<number>;
  temp: ITelemetryCorners<number>;

  constructor(data: TelemetryDataArrayWrapper) {
    this.slipRatio = new TelemetryCorner(data, 'tireSlipRatio');
    this.slipAngle = new TelemetryCorner(data, 'tireSlipAngle');
    this.combinedSlip = new TelemetryCorner(data, 'tireCombinedSlip');
    this.temp = new TelemetryCorner(data, 'tireTemp');
  }
}
