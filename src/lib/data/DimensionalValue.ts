import { TelemetryDataArrayWrapper } from './TelemetryDataArrayWrapper';
import { IDimensionalValue } from '../types';

type DimensionalPrefix =
  | 'acceleration'
  | 'velocity'
  | 'angularVelocity'
  | 'position';

export class DimensionalValue implements IDimensionalValue<number> {
  x: number;
  y: number;
  z: number;

  constructor(data: TelemetryDataArrayWrapper, prefix: DimensionalPrefix) {
    this.x = data.byName(`${prefix}X`);
    this.y = data.byName(`${prefix}Y`);
    this.z = -data.byName(`${prefix}Z`);
  }
}
