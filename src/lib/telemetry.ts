// import { ITelemetryLap } from './types';

// export interface IWheelsData {
//   rotationSpeed: ITelemetryCorners<number>;
//   onRumbleStrip: ITelemetryCorners<number>;
//   inPuddleDepth: ITelemetryCorners<number>;
//   surfaceRumble: ITelemetryCorners<number>;
// }

// export interface ITiresData {
//   slipRatio: ITelemetryCorners<number>;
//   slipAngle: ITelemetryCorners<number>;
//   combinedSlip: ITelemetryCorners<number>;
//   temp: ITelemetryCorners<number>;
// }

// export interface ISuspensionTravel {
//   normalized: ITelemetryCorners<number>;
//   meters: ITelemetryCorners<number>;
// }

// export interface ICarControls {
//   accelerator: number;
//   brake: number;
//   clutch: number;
//   handbrake: number;
//   gear: number;
//   steer: number;
// }

// export interface ICar {
//   make: string;
//   model: string;
//   ordinal: number;
//   class: number;
//   pi: number;
//   drivetrain: number;
//   cylinders: number;
//   category: number;
//   engineMaxRpm: number;
//   engineIdleRpm: number;
// }

// export interface IRace {
//   car: ICar;
//   bestLapTime: number;
//   currentRaceTime: number;
//   laps: ITelemetryLap[];
// }

// export interface ICarMovement {
//   acceleration: IDimensionalValue<number>;
//   velocity: IDimensionalValue<number>;
//   angularVelocity: IDimensionalValue<number>;
//   yaw: number;
//   pitch: number;
//   roll: number;
// }

// export interface ICarEngine {
//   currentEngineRpm: number;
//   speed: number;
//   power: number;
//   torque: number;
//   boost: number;
//   fuel: number;
// }

// export interface ITelemetryDataPoint {
//   epochMs: number;
//   timestampMS: number;
//   lapTime: number;
//   raceTime: number;
//   racePosition: number;
//   lap: number;
//   distance: number;

//   engine: ICarEngine;
//   controls: ICarControls;
//   movement: ICarMovement;
//   position: IDimensionalValue<number>;
//   suspensionTravel: ISuspensionTravel;
//   wheels: IWheelsData;
//   tires: ITiresData;
// }
