import { TelemetryDataArrayWrapper } from 'forza-open-telemetry-server';
import { ITelemetryCorners } from '../types';
import { TelemetryCorner } from './TelemetryCorner';


export class TiresData {
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
