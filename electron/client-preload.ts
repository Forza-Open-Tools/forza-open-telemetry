import { contextBridge, ipcRenderer } from 'electron';
import { TelemetryDataArray } from 'forza-open-telemetry-server/dist';
import { AddressInfo } from 'net';

export interface CollectorClientIpcApi {
  start(): CollectorClientIpcApi;
  stop(): CollectorClientIpcApi;
  restart(): CollectorClientIpcApi;
  onTelemetry(handler: (data: TelemetryDataArray) => void): CollectorClientIpcApi;
  onClosed(handler: (reason: string) => void): CollectorClientIpcApi;
  onStarted(handler: (addressInfo: AddressInfo) => void): CollectorClientIpcApi;
  onStopped(handler: () => void): CollectorClientIpcApi;
  onRestarted(handler: (addressInfo: AddressInfo) => void): CollectorClientIpcApi;
}

declare global {
  interface Window {
    collectorApi: CollectorClientIpcApi;
  }
}

interface ClientMessageHandlersMap {
  telemetry: (data: TelemetryDataArray) => void;
  closed: (reason: string) => void;
  started: (addressInfo: AddressInfo) => void;
  stopped: () => void;
  restarted: (addressInfo: AddressInfo) => void;
}

interface ClientIpcRendererState {
  port: MessagePort | null;
  handlersMap: ClientMessageHandlersMap;
  cachedTelemetry: TelemetryDataArray[],
}

const state: ClientIpcRendererState = {
  port: null,
  handlersMap: {
    telemetry: (data) => {
      state.cachedTelemetry.push(data);
    },
    closed: () => { },
    started: () => { },
    stopped: () => { },
    restarted: () => { },
  },
  cachedTelemetry: [],
}

ipcRenderer.on('collector-message-port', (event) => {
  state.port = event.ports[0];
  state.port.addEventListener('message', (msgEvent) => {
    if (msgEvent.type in state.handlersMap) {
      const eventType = msgEvent.type as keyof ClientMessageHandlersMap;
      const handler = state.handlersMap[eventType];
      handler(msgEvent.data.payload);
    }
  });
});

ipcRenderer.send('connect-to-collector');


const collectorApi: CollectorClientIpcApi = {
  start: () => {
    state.port?.postMessage('start');
    return collectorApi;
  },
  stop: () => {
    state.port?.postMessage('stop');
    return collectorApi;
  },
  restart: () => {
    state.port?.postMessage('restart');
    return collectorApi;
  },
  onTelemetry: (handler) => {
    state.cachedTelemetry.forEach((data) => {
      handler(data);
    });
    state.handlersMap.telemetry = handler;
    return collectorApi;
  },
  onClosed: (handler) => {
    state.handlersMap.closed = handler;
    return collectorApi;
  },
  onStarted: (handler) => {
    state.handlersMap.started = handler;
    return collectorApi;
  },
  onStopped: (handler) => {
    state.handlersMap.stopped = handler;
    return collectorApi;
  },
  onRestarted: (handler) => {
    state.handlersMap.restarted = handler;
    return collectorApi;
  },
};

contextBridge.exposeInMainWorld('collectorApi', collectorApi);

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector: string, text: string | undefined) => {
//     const element = document.getElementById(selector);
//     if (element) element.innerText = text || '';
//   }

//   for (const dependency of ['chrome', 'node', 'electron']) {
//     replaceText(`${dependency}-version`, process.versions[dependency]);
//   }
// });

// const socketPromise = new Promise<string>((resolve) => {
//   ipcRenderer.on('set-socket', (event, { name }) => {
//     resolve(name);
//   });
// });

// function ipcConnect(): Promise<NodeIpcClient> {
//   return socketPromise.then((name) => {
//     return new Promise((resolve) => {
//       ipc.config.silent = true;
//       ipc.connectTo(name, () => {
//         resolve(ipc.of[name]);
//       });
//     });
//   })
// }

// Makes the ipcConnect function available in the client
// window.ipcConnect = ipcConnect;
