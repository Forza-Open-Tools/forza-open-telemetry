import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import { TelemetryRow } from 'forza-open-telemetry-server';
import { TelemetryDataRow } from './types';

dayjs.extend(duration);
dayjs.extend(utc);

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

function resolveTelemetryValue(header: keyof TelemetryRow, value: number): number {
  if (header === 'lap') return value + 1;
  if (header === 'positionZ') return -value;
  return value;
}

export function convertTelemetryArray(dataRow: TelemetryDataRow): TelemetryRow {
  const headerOffset = dataRow.length === 86 ? 1 : 0;
  return dataRow.reduce((acc, value, index) => {
    const header = headers[index + headerOffset];
    const resolved = resolveTelemetryValue(header, value as number);
    return {
      ...acc,
      [header]: resolved,
    };
  }, { epochMs: 0 } as TelemetryRow);
}

export function formatLapTime(time: number): string {
  return dayjs(time).format('m:ss.SSS');
}

const kphConversion = 0.6213711922;

export function calcSpeed(speed: number, toImperial = false): number {
  const kph = speed * 3.6;
  const converted = toImperial ? kph * kphConversion : kph;

  return round(converted, 1);
}

export function formatSpeed(speed: number, toImperial = false): string {
  const converted = calcSpeed(speed, toImperial);
  const unit = toImperial ? 'mph' : 'kph';
  return `${converted} ${unit}`;
}

export function round(num: number, precision: number) {
  const multiplier = Math.pow(10, precision);
  const m = Number((Math.abs(num) * multiplier).toPrecision(15));
  return Math.round(m) / multiplier * Math.sign(num);
}

export function formatAsPercent(value: number, precision = 1): string {
  return `${round(value * 100, precision).toFixed(precision)}%`;
}

export function formatAsTemp(value: number, fahrenheit = false) {
  const temp = fahrenheit ? value * 9 / 5 + 32 : value;
  return `${round(temp, 0)}°${fahrenheit ? 'f' : 'c'}`;
}

// Convert from radians to degrees.
export function angleDegree(radians: number): number {
	return radians * 180 / Math.PI;
}

export function radians(degrees: number): number {
	return degrees * Math.PI / 180;
}
