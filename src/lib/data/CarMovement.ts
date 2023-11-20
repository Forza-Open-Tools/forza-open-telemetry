import { TelemetryDataRow } from '../TelemetryDataRow';
import { ICarMovement, IDimensionalValue } from '../types';
import { DimensionalValue } from './DimensionalValue';

export class CarMovement implements ICarMovement {
  acceleration: IDimensionalValue<number>;
  velocity: IDimensionalValue<number>;
  angularVelocity: IDimensionalValue<number>;
  yaw: number;
  pitch: number;
  roll: number;

  constructor(data: TelemetryDataRow) {
    this.acceleration = new DimensionalValue(data, 'acceleration');
    this.velocity = new DimensionalValue(data, 'velocity');
    this.angularVelocity = new DimensionalValue(data, 'angularVelocity');
    this.yaw = data.byName('yaw');
    this.pitch = data.byName('pitch');
    this.roll = data.byName('roll');
  }
}
