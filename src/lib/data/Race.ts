import { TelemetryDataArray } from 'forza-open-telemetry-server';
import { TelemetryDataArrayWrapper } from './TelemetryDataArrayWrapper';
import { RaceCar } from './RaceCar';
import { TelemetryLap } from './TelemetryLap';
import { IRace } from '../types';

export class Race implements IRace {
  laps: TelemetryLap[] = [];
  previousLap: TelemetryLap | null = null;
  currentLap: TelemetryLap;

  startTs: number;
  endTs: number;

  car: RaceCar;

  rawData: TelemetryDataArray[] = [];

  constructor(data: TelemetryDataArrayWrapper) {
    this.currentLap = new TelemetryLap(data.byName('lap'));
    this.startTs = data.byName('timestampMS');
    this.endTs = this.startTs;

    this.car = new RaceCar(data);
  }

  add(data: TelemetryDataArrayWrapper) {
    this.rawData.push(data.data);
    const lapNum = data.byName('lap');
    if (lapNum !== this.currentLap.lap) {
      this.previousLap = this.currentLap;
      this.currentLap = new TelemetryLap(lapNum);
      this.laps.push(this.currentLap);
    }

    this.currentLap.add(data);
    this.endTs = data.byName('timestampMS');
  }

  getFileName(): string {
    const parts: string[] = [];
    if (this.car.make) parts.push(this.car.make);
    if (this.car.model) parts.push(this.car.model);
    if (!this.car.make || !this.car.model) parts.push(this.car.ordinal.toString());
    parts.push(`${this.car.carClass}${this.car.pi.toString()}`);
    parts.push(this.startTs.toString());
    return parts.join('-');
  }
}
