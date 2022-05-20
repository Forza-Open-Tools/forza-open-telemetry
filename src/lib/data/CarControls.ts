import { ICarControls } from '../types';
import { TelemetryDataArrayWrapper } from './TelemetryDataArrayWrapper';

export class CarControls implements ICarControls {
  accelerator: number;
  brake: number;
  clutch: number;
  handbrake: number;
  gear: number;
  steer: number;

  constructor(data: TelemetryDataArrayWrapper) {
    this.accelerator = data.byName('accelerator');
    this.brake = data.byName('brake');
    this.clutch = data.byName('clutch');
    this.handbrake = data.byName('handbrake');
    this.gear = data.byName('gear');
    this.steer = data.byName('steer');
  }
}
