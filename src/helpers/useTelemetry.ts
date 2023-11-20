import { TelemetryDataRow } from '../lib';
import { reactive, readonly } from 'vue';
import { Race } from '../lib/data/Race';
import useSocket from '../components/useSocket';
import { PropertyToIndexMap } from '../lib/PropertyToIndexMap';
import { dashFormatLabels } from '../lib/dash-format-labels';

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

const socket = useSocket();

function onTelemetry(data: number[]): void {
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

function connect() {
  socket.connect();
}

function disconnect() {
  socket.disconnect();
}

const map = new PropertyToIndexMap(dashFormatLabels)

function processDataArray(raw: number[]) {
  const data = new TelemetryDataRow(map, raw);

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

function load(rows: number[][]) {
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
