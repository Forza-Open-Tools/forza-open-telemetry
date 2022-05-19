import { Statistics } from './Statistics';
import { CarCorner, ITelemetryCorners, ITelemetryValuePair, TelemetryCornerPrefix } from '../types';

export class CarCornerStatistics implements ITelemetryCorners<Statistics> {
  front: ITelemetryValuePair<Statistics>;
  rear: ITelemetryValuePair<Statistics>;

  constructor(private fieldName: TelemetryCornerPrefix) {
    this.front = {
      left: new Statistics(),
      right: new Statistics(),
    };
    this.rear = {
      left: new Statistics(),
      right: new Statistics(),
    };
  }

  add(data: ITelemetryCorners<number>) {
    this.front.left.add(data.front.left);
    this.front.right.add(data.front.right);
    this.rear.left.add(data.rear.left);
    this.rear.right.add(data.rear.right);
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
