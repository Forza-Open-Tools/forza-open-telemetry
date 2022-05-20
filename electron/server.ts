import { ipcRenderer } from 'electron';
import { Parser } from 'forza-open-telemetry-server';
import { TelemetryIpcServer, TelemetryIpcClient } from '../src/lib/ipc';
import IpcServer from './IpcServer';
import Collector from './Collector';

(async () => {
  const ipcHandlers = {
    startCollector: () => collector.start(),
    stopCollector: () => collector.stop(),
    restartCollector: async () => {
      if (collector.isRunning()) {
        await collector.stop();
      }
      return collector.start();
    },
    isRunning: () => Promise.resolve(collector.isRunning()),
    setPort: (port: number) => collector.setPort(port),
  };
  let ipcServer: IpcServer<TelemetryIpcServer, TelemetryIpcClient>;

  if (process.argv[2] === '--subprocess') {
    const socketName = process.argv[4];
    ipcServer = new IpcServer<TelemetryIpcServer, TelemetryIpcClient>(socketName, ipcHandlers);
  } else {
    ipcRenderer.on('set-socket', (event, { name }) => {
      ipcServer = new IpcServer<TelemetryIpcServer, TelemetryIpcClient>(name, ipcHandlers);
    });
  }

  const parser = new Parser('ForzaHorizon5');

  function messageHandler(buf: Buffer) {
    const data = parser.toArray(buf);
    if (data[1]) {
      ipcServer.send('telemetry', data);
    }
  }

  const collector = new Collector(11000, messageHandler);
})();
