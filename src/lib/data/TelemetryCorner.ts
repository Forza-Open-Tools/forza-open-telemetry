import { TelemetryDataArrayWrapper } from './TelemetryDataArrayWrapper';
import { CarCorner, TelemetryCornerPrefix, ITelemetryCorners, ITelemetryValuePair } from '../types';

export class TelemetryCorner implements ITelemetryCorners<number> {
  front: ITelemetryValuePair<number>;
  rear: ITelemetryValuePair<number>;

  constructor(data: TelemetryDataArrayWrapper, prefix: TelemetryCornerPrefix) {
    this.front = {
      left: data.byName(`${prefix}${CarCorner.frontLeft}`),
      right: data.byName(`${prefix}${CarCorner.frontRight}`),
    };
    this.rear = {
      left: data.byName(`${prefix}${CarCorner.rearLeft}`),
      right: data.byName(`${prefix}${CarCorner.rearRight}`),
    };
  }

  private lookup = {
    [CarCorner.frontLeft]: () => this.front.left,
    [CarCorner.frontRight]: () => this.front.right,
    [CarCorner.rearLeft]: () => this.rear.left,
    [CarCorner.rearRight]: () => this.rear.right,
  }

  getCornerValue(corner: CarCorner) {
    return this.lookup[corner]();
  }
}
