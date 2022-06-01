import { TelemetryDataArray } from '../lib/data';
import { AddressInfo } from 'net';
import { reactive, readonly } from 'vue';
import { Race } from '../lib/data/Race';
import { TelemetryDataArrayWrapper } from '../lib/data/TelemetryDataArrayWrapper';

const state = reactive({
  streamingError: '',
  streaming: false,
  address: '',
  port: 0,
  isRaceOn: false,
  currentRace: null as Race | null,
  races: [] as Race[],
  savedRaces: [] as string[],
});

function onTelemetry(data: TelemetryDataArray): void {
  processDataArray(data);
}

function onClosed(reason: string): void {
  console.log('Collector unexpected closed:', reason);
  state.streamingError = reason;
  state.streaming = false;
}

function getDefaultResolveReject() {
  return {
    resolve(value?: unknown) { },
    reject(reason: string) { },
  };
}

function connect(address: string) {

}

function disconnect() {

}

function processDataArray(raw: TelemetryDataArray) {
  const data = new TelemetryDataArrayWrapper(raw);

  if (!data.byName('isRaceOn')) {
    state.isRaceOn = false;
    // Finalize the current race?
  } else {
    if (!state.currentRace || !state.isRaceOn) {
      state.currentRace = new Race(data);
      state.races.push(state.currentRace);
    }
    state.currentRace!.add(data);
  }
}

function load(rows: TelemetryDataArray[]) {
  const current = state.currentRace;
  rows.forEach(processDataArray);
  const race = state.currentRace;
  if (current) {
    state.currentRace = current;
  }
  return race;
}

export function useTelemetry() {
  return {
    state: readonly(state),
    load,
    connect,
    disconnect,
  };
}
