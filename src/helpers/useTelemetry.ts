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

const promises = {
  started: getDefaultResolveReject(),
  stopped: getDefaultResolveReject(),
  restarted: getDefaultResolveReject(),
};

function createPromise(name: 'started' | 'stopped' | 'restarted', executor: () => void) {
  return new Promise((resolve, reject) => {
    promises[name] = { resolve, reject };
    executor();
  });
}

function onStarted(addressInfo: AddressInfo): void {
  console.log('Collector has started');
  state.address = addressInfo.address;
  state.port = addressInfo.port;
  state.streaming = true;
  promises.started.resolve();
}

function onStopped(): void {
  console.log('Collector has stopped');
  state.address = '';
  state.port = 0;
  state.streaming = false;
  promises.stopped.resolve();
}

function onRestarted(addressInfo: AddressInfo): void {
  console.log('Collector has restarted');
  state.address = addressInfo.address;
  state.port = addressInfo.port;
  state.streaming = true;
  promises.restarted.resolve();
}

window.collectorApi
  .onTelemetry(onTelemetry)
  .onClosed(onClosed)
  .onStarted(onStarted)
  .onStopped(onStopped)
  .onRestarted(onRestarted);

function load(rows: TelemetryDataArray[]) {
  const current = state.currentRace;
  rows.forEach(processDataArray);
  const race = state.currentRace;
  if (current) {
    state.currentRace = current;
  }
  return race;
}

function stopCollector() {
  return createPromise('stopped', () => {
    window.collectorApi.stop();
  });
}

function startCollector() {
  return createPromise('started', () => {
    window.collectorApi.start();
  });
}

function toggleCollector() {
  if (state.streaming) {
    return stopCollector();
  } else if (!state.streamingError) {
    return startCollector();
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
