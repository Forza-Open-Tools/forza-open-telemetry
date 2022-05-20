import { TelemetryDataArrayWrapper } from './TelemetryDataArrayWrapper';
import { IDimensionalValue } from '../types';
import { Statistics } from './Statistics';


export class DimensionalStatistics implements IDimensionalValue<Statistics> {
  x = new Statistics();
  y = new Statistics();
  z = new Statistics();

  add(data: IDimensionalValue<number>) {
    this.x.add(data.x);
    this.y.add(data.y);
    this.z.add(data.z);
  }
}
