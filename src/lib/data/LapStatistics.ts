import { CarCornerStatistics } from './CarCornerStatistics';
import { DimensionalStatistics } from './DimensionalStatistics';
import { Statistics } from './Statistics';
import { TelemetryDataPoint } from './TelemetryDataPoint';

export class LapStatistics {
  normalizedSuspensionTravel = new CarCornerStatistics('normalizedSuspensionTravel');
  tireTemp = new CarCornerStatistics('tireTemp');
  speed = new Statistics();
  position = new DimensionalStatistics();

  add(data: TelemetryDataPoint) {
    this.normalizedSuspensionTravel.add(data.suspensionTravel.normalized);
    this.tireTemp.add(data.tires.temp);
    this.speed.add(data.engine.speed);
    this.position.add(data.position);
  }
}
