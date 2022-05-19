import { TelemetryDataArray, TelemetryDataArrayWrapper } from 'forza-open-telemetry-server';
import { IDimensionalValue } from '../types';
import { CarControls } from './CarControls';
import { CarEngine } from './CarEngine';
import { CarMovement } from './CarMovement';
import { DimensionalValue } from './DimensionalValue';
import { SuspensionTravel } from './SuspensionTravel';
import { TiresData } from './TiresData';
import { WheelsData } from './WheelsData';

export class TelemetryDataPoint {
  epochMs: number;
  timestampMS: number;
  lapTime: number;
  raceTime: number;
  racePosition: number;
  lap: number;
  distance: number;
  engine: CarEngine;
  controls: CarControls;
  movement: CarMovement;
  position: IDimensionalValue<number>;
  suspensionTravel: SuspensionTravel;
  wheels: WheelsData;
  tires: TiresData;

  constructor(public data: TelemetryDataArrayWrapper) {
    this.epochMs = this.data.byName('epochMs');
    this.timestampMS = this.data.byName('timestampMS');
    this.lapTime = this.data.byName('currentLapTime');
    this.raceTime = this.data.byName('currentRaceTime');
    this.racePosition = this.data.byName('racePosition');
    this.lap = this.data.byName('lap');
    this.distance = this.data.byName('distance');
    this.engine = new CarEngine(this.data);
    this.controls = new CarControls(this.data);
    this.movement = new CarMovement(this.data);
    this.position = new DimensionalValue(this.data, 'position');
    this.suspensionTravel = new SuspensionTravel(this.data);
    this.wheels = new WheelsData(this.data);
    this.tires = new TiresData(this.data);
  }
}
