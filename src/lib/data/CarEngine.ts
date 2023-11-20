import { TelemetryDataRow } from '../TelemetryDataRow';
import { ICarEngine } from '../types';

export class CarEngine implements ICarEngine {
  rpm: number;
  speed: number;
  power: number;
  torque: number;
  boost: number;
  fuel: number;

  constructor(data: TelemetryDataRow) {
    this.rpm = data.byName('currentEngineRpm');
    this.speed = data.byName('speed');
    this.power = data.byName('power');
    this.torque = data.byName('torque');
    this.boost = data.byName('boost');
    this.fuel = data.byName('fuel');
  }
}
