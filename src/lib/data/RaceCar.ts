import { TelemetryDataArrayWrapper } from 'forza-open-telemetry-server';

const carClassLookup: Record<number, string> = {
  1: 'D',
  2: 'C',
  3: 'B',
  4: 'A',
  5: 'S1',
  6: 'S2',
  7: 'X',
};

export class RaceCar {
  ordinal: number;
  carClassId: number;
  carClass: string;
  pi: number;
  drivetrainTypeId: number;
  cylinders: number;
  maxRpm: number;
  categoryId: number;

  make = '';
  model = '';

  constructor(data: TelemetryDataArrayWrapper) {
    this.ordinal = data.byName('carOrdinal');
    this.carClassId = data.byName('carClass');
    this.carClass = carClassLookup[this.carClassId] || this.carClassId.toString();
    this.pi = data.byName('carPerformanceIndex');
    this.drivetrainTypeId = data.byName('drivetrainType');
    this.cylinders = data.byName('numCylinders');
    this.maxRpm = data.byName('engineMaxRpm');
    this.categoryId = data.byName('carCategory');
  }
}
