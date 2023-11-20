import { ipcRenderer } from 'electron';
import { Parser, Collector } from 'forza-open-telemetry-server';
import { TelemetryIpcServer, TelemetryIpcClient } from '../src/lib/ipc';

const parser = new Parser('ForzaHorizon5');

function messageHandler(buf: Buffer) {
  const data = parser.toArray(buf);
  window.collectorServerApi.telemetry(data);
  // if (data[1]) {
  //   ipcServer.send('telemetry', data);
  // }
}

const collector = new Collector(11000, messageHandler);

async function onStart() {
  await collector.start();
  window.collectorServerApi.started(collector.address());
}

async function onStop() {
  await collector.stop();
  window.collectorServerApi.stopped();
}

async function onRestart() {
  await collector.stop();
  await collector.start();
  window.collectorServerApi.restarted(collector.address());
}

async function onUsePort(port: number) {
  await collector.setPort(port);
  const addressInfo = collector.address();
  if (addressInfo) {
    window.collectorServerApi.started(addressInfo);
  }
}

window.collectorServerApi
  .onStart(onStart)
  .onStop(onStop)
  .onRestart(onRestart);
