import { TelemetryDataArray } from './TelemetryDataArray';
import { TelemetryDataRow } from './TelemetryDataRow';

function getTelemetryDataArrayIndexMap(): Readonly<TelemetryIndexMap<TelemetryDataRow>> {
  let index = 0;
  return {
    epochMs: index++,
    isRaceOn: index++,
    timestampMS: index++,
    engineMaxRpm: index++,
    engineIdleRpm: index++,
    currentEngineRpm: index++,
    accelerationX: index++,
    accelerationY: index++,
    accelerationZ: index++,
    velocityX: index++,
    velocityY: index++,
    velocityZ: index++,
    angularVelocityX: index++,
    angularVelocityY: index++,
    angularVelocityZ: index++,
    yaw: index++,
    pitch: index++,
    roll: index++,
    normalizedSuspensionTravelFrontLeft: index++,
    normalizedSuspensionTravelFrontRight: index++,
    normalizedSuspensionTravelRearLeft: index++,
    normalizedSuspensionTravelRearRight: index++,
    tireSlipRatioFrontLeft: index++,
    tireSlipRatioFrontRight: index++,
    tireSlipRatioRearLeft: index++,
    tireSlipRatioRearRight: index++,
    wheelRotationSpeedFrontLeft: index++,
    wheelRotationSpeedFrontRight: index++,
    wheelRotationSpeedRearLeft: index++,
    wheelRotationSpeedRearRight: index++,
    wheelOnRumbleStripFrontLeft: index++,
    wheelOnRumbleStripFrontRight: index++,
    wheelOnRumbleStripRearLeft: index++,
    wheelOnRumbleStripRearRight: index++,
    wheelInPuddleDepthFrontLeft: index++,
    wheelInPuddleDepthFrontRight: index++,
    wheelInPuddleDepthRearLeft: index++,
    wheelInPuddleDepthRearRight: index++,
    surfaceRumbleFrontLeft: index++,
    surfaceRumbleFrontRight: index++,
    surfaceRumbleRearLeft: index++,
    surfaceRumbleRearRight: index++,
    tireSlipAngleFrontLeft: index++,
    tireSlipAngleFrontRight: index++,
    tireSlipAngleRearLeft: index++,
    tireSlipAngleRearRight: index++,
    tireCombinedSlipFrontLeft: index++,
    tireCombinedSlipFrontRight: index++,
    tireCombinedSlipRearLeft: index++,
    tireCombinedSlipRearRight: index++,
    suspensionTravelMetersFrontLeft: index++,
    suspensionTravelMetersFrontRight: index++,
    suspensionTravelMetersRearLeft: index++,
    suspensionTravelMetersRearRight: index++,
    carOrdinal: index++,
    carClass: index++,
    carPerformanceIndex: index++,
    drivetrainType: index++,
    numCylinders: index++,
    carCategory: index++,
    unknown1: index++,
    unknown2: index++,
    positionX: index++,
    positionY: index++,
    positionZ: index++,
    speed: index++,
    power: index++,
    torque: index++,
    tireTempFrontLeft: index++,
    tireTempFrontRight: index++,
    tireTempRearLeft: index++,
    tireTempRearRight: index++,
    boost: index++,
    fuel: index++,
    distance: index++,
    bestLapTime: index++,
    lastLapTime: index++,
    currentLapTime: index++,
    currentRaceTime: index++,
    lap: index++,
    racePosition: index++,
    accelerator: index++,
    brake: index++,
    clutch: index++,
    handbrake: index++,
    gear: index++,
    steer: index++,
    normalDrivingLine: index++,
    normalAiBrakeDifference: index++,
  };
}

type TelemetryIndexMap<T> = Record<keyof T, number>

type TelemetryDataRowNoEpochMs = Omit<TelemetryDataRow, 'epochMs'>;
type TelemetryDataRowNoUnknowns = Omit<TelemetryDataRow, 'unknown1' | 'unknown2'>;

function createMap<T extends TelemetryDataRowNoEpochMs | TelemetryDataRowNoUnknowns>(mapByName: TelemetryIndexMap<TelemetryDataRow>, fieldsToOmit: (keyof TelemetryDataRow)[]) {
  const map = {} as TelemetryIndexMap<T>;
  let offset = 0;
  Object.entries(mapByName).forEach(([key, value]) => {
    if (fieldsToOmit.includes(key as keyof TelemetryDataRow)) {
      offset += 1;
      return;
    }
    map[key as keyof T] = value - offset;
  });
  return map;
}

function createMapByIndex<T extends TelemetryDataRowNoEpochMs | TelemetryDataRowNoUnknowns>(source: Record<keyof T, number>) {
  const map: Record<number, keyof T> = {};
  Object.entries(source).forEach(([key, value]) => {
    map[value] = key as keyof T;
  });
  return map;
}

const mapByNameFull = getTelemetryDataArrayIndexMap();
// const mapByNameNoEpochMs = createMap(mapByNameFull, ['epochMs']);
// const mapByNameNoUnknown = createMap(mapByNameFull, ['unknown1', 'unknown2']);
// const mapByNameNoEpochNoUnknown = createMap(mapByNameFull, ['epochMs', 'unknown1', 'unknown2']);

const fullLength = Object.keys(mapByNameFull).length;
const mapLengths = {
  full: fullLength,
  noEpochMs: fullLength - 1,
  noUnknown: fullLength - 2,
  noEpochNoUnknown: fullLength - 3,
}

// const mapsByName = {
//   [Object.keys(mapByNameFull).length]: mapByNameFull,
//   [Object.keys(mapByNameNoEpochMs).length]: mapByNameNoEpochMs,
//   [Object.keys(mapByNameNoUnknown).length]: mapByNameNoUnknown,
//   [Object.keys(mapByNameNoEpochNoUnknown).length]: mapByNameNoEpochNoUnknown,
// }

// const mapsByIndex = {
//   [Object.keys(mapByNameFull).length]: createMapByIndex(mapByNameFull),
//   [Object.keys(mapByNameNoEpochMs).length]: createMapByIndex(mapByNameNoEpochMs),
//   [Object.keys(mapByNameNoUnknown).length]: createMapByIndex(mapByNameNoUnknown),
//   [Object.keys(mapByNameNoEpochNoUnknown).length]: createMapByIndex(mapByNameNoEpochNoUnknown),
// }

function addMissingFields(data: unknown[]): TelemetryDataArray {
  const updated = [...data] as TelemetryDataArray;
  if (updated.length === mapLengths.full) {
    return updated;
  }
  if (updated.length === mapLengths.noEpochMs) {
    updated.splice(0, 0, updated[1]);
  } else if (updated.length === mapLengths.noUnknown) {
    updated.splice(mapByNameFull.unknown1, 0, -999, -999);
  } else if (updated.length === mapLengths.noEpochNoUnknown) {
    updated.splice(0, 0, updated[1]);
    updated.splice(mapByNameFull.unknown1, 0, -999, -999);
  }
  return updated;
}

export class TelemetryDataArrayWrapper {
  dataArray: TelemetryDataArray;

  constructor(dataArray: TelemetryDataArray) {
    this.dataArray = addMissingFields(dataArray);
  }

  byIndex<T extends number | boolean = number>(index: number): T {
    return this.dataArray[index] as T;
  }

  byName<T extends number | boolean = number>(name: keyof TelemetryDataRow): T {
    const index = mapByNameFull[name];
    return this.dataArray[index] as T;
  }

  get data() {
    return this.dataArray;
  }
}
