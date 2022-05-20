import { TelemetryDataArray } from 'forza-open-telemetry-server';
import { AddressInfo } from 'net';
import { reactive, readonly } from 'vue';
import { Race } from '../lib/data/Race';
import { TelemetryDataArrayWrapper } from '../lib/data/TelemetryDataArrayWrapper';
import { useIpcClient } from './useIpcClient';

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

function onTelemetry(raw: TelemetryDataArray): Promise<void> {
  processDataArray(raw);
  return Promise.resolve();
}

const ipcClient = useIpcClient({
  telemetry: onTelemetry,
  collectorClosed: (reason) => {
    console.log('Collector unexpected closed:', reason);
    state.streamingError = reason;
    state.streaming = false;
    return Promise.resolve();
  },
});

function load(rows: TelemetryDataArray[]) {
  const current = state.currentRace;
  rows.forEach(processDataArray);
  const race = state.currentRace;
  if (current) {
    state.currentRace = current;
  }
  return race;
}

async function stopCollector() {
  await ipcClient.send('stopCollector');
  state.address = '';
  state.port = 0;
  state.streaming = false;
}

async function startCollector() {
  const { address, port } = await ipcClient.send<AddressInfo>('startCollector');
  state.address = address;
  state.port = port;
  state.streaming = true;
}

async function toggleCollector() {
  if (state.streaming) {
    await stopCollector();
  } else if (!state.streamingError) {
    await startCollector();
  }
}

export function useTelemetry() {
  return {
    state: readonly(state),
    load,
    stopCollector,
    startCollector,
    toggleCollector,
  };
}
