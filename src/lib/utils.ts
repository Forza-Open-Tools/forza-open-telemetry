import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import { TelemetryDataArray, TelemetryDataRow, TelemetryDataArrayLookup } from 'forza-open-telemetry-server';
import { CarCorner, TelemetryCornerPrefix } from './types';

dayjs.extend(duration);
dayjs.extend(utc);

export function round(num: number, precision: number) {
  const multiplier = Math.pow(10, precision);
  const m = Number((Math.abs(num) * multiplier).toPrecision(15));
  return Math.round(m) / multiplier * Math.sign(num);
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
  return `${converted.toFixed(1)} ${unit}`;
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
