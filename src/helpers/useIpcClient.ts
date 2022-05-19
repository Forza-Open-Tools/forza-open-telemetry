import { TelemetryIpcClient, TelemetryIpcServer, IpcClient } from '../lib/ipc';

export function useIpcClient(handlers: TelemetryIpcClient) {
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
