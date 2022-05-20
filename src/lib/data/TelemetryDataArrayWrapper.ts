import { TelemetryDataRow, TelemetryDataArray } from 'forza-open-telemetry-server';

function getTelemetryDataArrayIndexNames(): Readonly<Record<keyof TelemetryDataRow, number>> {
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

const mapByName = getTelemetryDataArrayIndexNames();

function createMapByIndex() {
  const map: Record<number, keyof TelemetryDataRow> = {};
  Object.entries(mapByName).forEach(([key, value]) => {
    map[value] = key as keyof TelemetryDataRow;
  });
  return map;
}

const mapByIndex = createMapByIndex();

export class TelemetryDataArrayLookup {
  indexOf(name: keyof TelemetryDataRow): number {
    return mapByName[name];
  }

  nameOf(index: number): keyof TelemetryDataRow {
    return mapByIndex[index];
  }
}

export class TelemetryDataArrayWrapper {
  lookup = new TelemetryDataArrayLookup();

  constructor(private dataArray: TelemetryDataArray) { }

  byIndex<T extends number | boolean = number>(index: number): T {
    return this.dataArray[index] as T;
  }

  byName<T extends number | boolean = number>(name: keyof TelemetryDataRow): T {
    return this.dataArray[this.lookup.indexOf(name)] as T;
  }

  get data() {
    return this.dataArray;
  }
}
