import { IRace } from '../types';
import { TelemetryDataArray } from './TelemetryDataArray';
import { TelemetryDataArrayWrapper } from './TelemetryDataArrayWrapper';
import { RaceCar } from './RaceCar';
import { TelemetryLap } from './TelemetryLap';
import { LapStatistics } from './LapStatistics';

export class Race implements IRace {
  laps: TelemetryLap[] = [];
  previousLap: TelemetryLap | null = null;
  currentLap: TelemetryLap;

  startTs: number;
  endTs: number;

  car: RaceCar;

  stats: LapStatistics = new LapStatistics();

  rawData: TelemetryDataArray[] = [];

  constructor(data: TelemetryDataArrayWrapper) {
    this.currentLap = new TelemetryLap(data.byName('lap'));
    this.laps.push(this.currentLap);
    this.startTs = data.byName('timestampMS');
    this.endTs = this.startTs;

    this.car = new RaceCar(data);
  }

  add(data: TelemetryDataArrayWrapper) {
    this.rawData.push(data.data);
    const lapIndex = data.byName('lap');
    if ((lapIndex + 1) !== this.currentLap.lap) {
      this.previousLap = this.currentLap;
      this.currentLap = new TelemetryLap(lapIndex);
      this.laps.push(this.currentLap);
    }

    const point = this.currentLap.add(data);
    this.stats.add(point);
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
