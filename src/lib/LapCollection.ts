import { TelemetryRow } from 'forza-open-telemetry-server';
import { TelemetryDataRow } from './types';
import TelemetryLap from './TelemetryLap';

const headers: Record<number, keyof TelemetryRow> = {
  0: 'epochMs',
  1: 'isRaceOn',
  2: 'timestampMS',
  3: 'engineMaxRpm',
  4: 'engineIdleRpm',
  5: 'currentEngineRpm',
  6: 'accelerationX',
  7: 'accelerationY',
  8: 'accelerationZ',
  9: 'velocityX',
  10: 'velocityY',
  11: 'velocityZ',
  12: 'angularVelocityX',
  13: 'angularVelocityY',
  14: 'angularVelocityZ',
  15: 'yaw',
  16: 'pitch',
  17: 'roll',
  18: 'normalizedSuspensionTravelFrontLeft',
  19: 'normalizedSuspensionTravelFrontRight',
  20: 'normalizedSuspensionTravelRearLeft',
  21: 'normalizedSuspensionTravelRearRight',
  22: 'tireSlipRatioFrontLeft',
  23: 'tireSlipRatioFrontRight',
  24: 'tireSlipRatioRearLeft',
  25: 'tireSlipRatioRearRight',
  26: 'wheelRotationSpeedFrontLeft',
  27: 'wheelRotationSpeedFrontRight',
  28: 'wheelRotationSpeedRearLeft',
  29: 'wheelRotationSpeedRearRight',
  30: 'wheelOnRumbleStripFrontLeft',
  31: 'wheelOnRumbleStripFrontRight',
  32: 'wheelOnRumbleStripRearLeft',
  33: 'wheelOnRumbleStripRearRight',
  34: 'wheelInPuddleDepthFrontLeft',
  35: 'wheelInPuddleDepthFrontRight',
  36: 'wheelInPuddleDepthRearLeft',
  37: 'wheelInPuddleDepthRearRight',
  38: 'surfaceRumbleFrontLeft',
  39: 'surfaceRumbleFrontRight',
  40: 'surfaceRumbleRearLeft',
  41: 'surfaceRumbleRearRight',
  42: 'tireSlipAngleFrontLeft',
  43: 'tireSlipAngleFrontRight',
  44: 'tireSlipAngleRearLeft',
  45: 'tireSlipAngleRearRight',
  46: 'tireCombinedSlipFrontLeft',
  47: 'tireCombinedSlipFrontRight',
  48: 'tireCombinedSlipRearLeft',
  49: 'tireCombinedSlipRearRight',
  50: 'suspensionTravelMetersFrontLeft',
  51: 'suspensionTravelMetersFrontRight',
  52: 'suspensionTravelMetersRearLeft',
  53: 'suspensionTravelMetersRearRight',
  54: 'carOrdinal',
  55: 'carClass',
  56: 'carPerformanceIndex',
  57: 'drivetrainType',
  58: 'numCylinders',
  59: 'carCategory',
  60: 'positionX',
  61: 'positionY',
  62: 'positionZ',
  63: 'speed',
  64: 'power',
  65: 'torque',
  66: 'tireTempFrontLeft',
  67: 'tireTempFrontRight',
  68: 'tireTempRearLeft',
  69: 'tireTempRearRight',
  70: 'boost',
  71: 'fuel',
  72: 'distance',
  73: 'bestLapTime',
  74: 'lastLapTime',
  75: 'currentLapTime',
  76: 'currentRaceTime',
  77: 'lap',
  78: 'racePosition',
  79: 'accelerator',
  80: 'brake',
  81: 'clutch',
  82: 'handbrake',
  83: 'gear',
  84: 'steer',
  85: 'normalDrivingLine',
  86: 'normalAiBrakeDifference',
};

export class LapCollection {
  _laps: TelemetryLap[] = [];
  _lastLapNum = 0;
  _lastLap: TelemetryLap | null = null;
  _currentLap: TelemetryLap | null = null;

  add(dataRow: TelemetryDataRow) {
    const row = this.convertTelemetryArray(dataRow);
    if (!this._lastLap || row.lap > this._lastLap.lap) {
      this.createLap(row);
    }
    this._currentLap?.add(row);
  }

  createLap(row: TelemetryRow) {
    const lap = new TelemetryLap(row.lap);
    this._laps.push(lap);
    this._lastLap = this._currentLap;
    this._currentLap = lap;

    if (this._lastLap && row.lastLapTime) {
      this._lastLap.updateTime(row.lastLapTime);
    }
  }

  convertTelemetryArray(dataRow: TelemetryDataRow): TelemetryRow {
    const headerOffset = dataRow.length === 86 ? 1 : 0;
    return dataRow.reduce((acc, value, index) => ({
      ...acc,
      [headers[index + headerOffset]]: value,
    }), { epochMs: 0 } as TelemetryRow);
  }
}
