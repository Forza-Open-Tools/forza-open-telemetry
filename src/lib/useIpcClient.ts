import IpcClient from './IpcClient';
import { TelemetryIpcClient, TelemetryIpcServer } from './ipc';

export default function useIpcClient(handlers: TelemetryIpcClient) {
  const client = new IpcClient<TelemetryIpcServer, TelemetryIpcClient>(handlers);

  client.connect();

  // function startCollector() {
  //   client.send('startCollector')
  // }

  // function stopCollector() {

  // }

  // function restartCollector() {

  // }

  // function isRunning() {

  // }

  // function setPort() {

  // }

  return {
    send: client.send,
  };
}
