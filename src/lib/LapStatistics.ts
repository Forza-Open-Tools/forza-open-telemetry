import { TelemetryRow } from 'forza-open-telemetry-server';
import Statistics from './Statistics';

export default class LapStatistics {
  normalizedSuspensionTravelFrontLeft = new Statistics();
  normalizedSuspensionTravelFrontRight = new Statistics();
  normalizedSuspensionTravelRearLeft = new Statistics();
  normalizedSuspensionTravelRearRight = new Statistics();
  tireSlipRatioFrontLeft = new Statistics();
  tireSlipRatioFrontRight = new Statistics();
  tireSlipRatioRearLeft = new Statistics();
  tireSlipRatioRearRight = new Statistics();
  wheelRotationSpeedFrontLeft = new Statistics();
  wheelRotationSpeedFrontRight = new Statistics();
  wheelRotationSpeedRearLeft = new Statistics();
  wheelRotationSpeedRearRight = new Statistics();
  tireSlipAngleFrontLeft = new Statistics();
  tireSlipAngleFrontRight = new Statistics();
  tireSlipAngleRearLeft = new Statistics();
  tireSlipAngleRearRight = new Statistics();
  tireCombinedSlipFrontLeft = new Statistics();
  tireCombinedSlipFrontRight = new Statistics();
  tireCombinedSlipRearLeft = new Statistics();
  tireCombinedSlipRearRight = new Statistics();
  tireTempFrontLeft = new Statistics();
  tireTempFrontRight = new Statistics();
  tireTempRearLeft = new Statistics();
  tireTempRearRight = new Statistics();
  speed = new Statistics();

  add(row: TelemetryRow) {
    this.normalizedSuspensionTravelFrontLeft.add(row.normalizedSuspensionTravelFrontLeft);
    this.normalizedSuspensionTravelFrontRight.add(row.normalizedSuspensionTravelFrontRight);
    this.normalizedSuspensionTravelRearLeft.add(row.normalizedSuspensionTravelRearLeft);
    this.normalizedSuspensionTravelRearRight.add(row.normalizedSuspensionTravelRearRight);
    this.tireSlipRatioFrontLeft.add(row.tireSlipRatioFrontLeft);
    this.tireSlipRatioFrontRight.add(row.tireSlipRatioFrontRight);
    this.tireSlipRatioRearLeft.add(row.tireSlipRatioRearLeft);
    this.tireSlipRatioRearRight.add(row.tireSlipRatioRearRight);
    this.wheelRotationSpeedFrontLeft.add(row.wheelRotationSpeedFrontLeft);
    this.wheelRotationSpeedFrontRight.add(row.wheelRotationSpeedFrontRight);
    this.wheelRotationSpeedRearLeft.add(row.wheelRotationSpeedRearLeft);
    this.wheelRotationSpeedRearRight.add(row.wheelRotationSpeedRearRight);
    this.tireSlipAngleFrontLeft.add(row.tireSlipAngleFrontLeft);
    this.tireSlipAngleFrontRight.add(row.tireSlipAngleFrontRight);
    this.tireSlipAngleRearLeft.add(row.tireSlipAngleRearLeft);
    this.tireSlipAngleRearRight.add(row.tireSlipAngleRearRight);
    this.tireCombinedSlipFrontLeft.add(row.tireCombinedSlipFrontLeft);
    this.tireCombinedSlipFrontRight.add(row.tireCombinedSlipFrontRight);
    this.tireCombinedSlipRearLeft.add(row.tireCombinedSlipRearLeft);
    this.tireCombinedSlipRearRight.add(row.tireCombinedSlipRearRight);
    this.tireTempFrontLeft.add(row.tireTempFrontLeft);
    this.tireTempFrontRight.add(row.tireTempFrontRight);
    this.tireTempRearLeft.add(row.tireTempRearLeft);
    this.tireTempRearRight.add(row.tireTempRearRight);
    this.speed.add(row.speed);
  }
}
