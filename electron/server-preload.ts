import { contextBridge, ipcRenderer } from 'electron';
import { TelemetryDataArray } from 'forza-open-telemetry-server/dist';
import { AddressInfo } from 'net';

declare global {
  interface Window {
    collectorServerApi: CollectorServerIpcApi;
  }
}

export interface CollectorServerIpcApi {
  onStart(handler: () => void): CollectorServerIpcApi;
  onStop(handler: () => void): CollectorServerIpcApi;
  onRestart(handler: () => void): CollectorServerIpcApi;
  onUsePort(handler: (port: number) => void): CollectorServerIpcApi;
  telemetry(data: TelemetryDataArray): CollectorServerIpcApi;
  close(reason: string): CollectorServerIpcApi;
  started(addressInfo: AddressInfo): CollectorServerIpcApi;
  stopped(): CollectorServerIpcApi;
  restarted(addressInfo: AddressInfo): CollectorServerIpcApi;
}

interface ServerMessageHandlersMap {
  start: () => void;
  stop: () => void;
  restart: () => void;
  usePort: (port: number) => void;
}

interface ServerIpcRendererState {
  port: MessagePort | null;
  handlersMap: ServerMessageHandlersMap;
}

const state: ServerIpcRendererState = {
  port: null,
  handlersMap: {
    start: () => { },
    stop: () => { },
    restart: () => { },
    usePort: (port: number) => { },
  },
}

ipcRenderer.on('new-client', (event) => {
  state.port = event.ports[0];
  state.port.addEventListener('message', (msgEvent) => {
    if (msgEvent.data.type in state.handlersMap) {
      const eventType = msgEvent.type as keyof ServerMessageHandlersMap;
      const handler = state.handlersMap[eventType];
      handler(msgEvent.data.payload);
    }
  });
});

type CollectorServerMessageTypes =
  | 'started'
  | 'stopped'
  | 'restarted'
  | 'telemetry'
  | 'close';

function postMessage<T>(type: CollectorServerMessageTypes, payload: T) {
  const msg = {
    type,
    payload,
  };
  state.port?.postMessage(msg);
}

const collectorServerApi: CollectorServerIpcApi = {
  started: (addressInfo: AddressInfo) => {
    postMessage('started', addressInfo)
    return collectorServerApi;
  },
  stopped: () => {
    postMessage('stopped', null);
    state.port?.postMessage('stopped');
    return collectorServerApi;
  },
  restarted: (addressInfo: AddressInfo) => {
    postMessage('restarted', addressInfo);
    return collectorServerApi;
  },
  telemetry: (data: TelemetryDataArray) => {
    postMessage('telemetry', data);
    return collectorServerApi;
  },
  close: (reason: string) => {
    postMessage('close', reason);
    return collectorServerApi;
  },
  onStart(handler) {
    state.handlersMap.start = handler;
    return collectorServerApi;
  },
  onStop(handler) {
    state.handlersMap.stop = handler;
    return collectorServerApi;
  },
  onRestart(handler) {
    state.handlersMap.restart = handler;
    return collectorServerApi;
  },
  onUsePort(handler) {
    state.handlersMap.usePort = handler;
    return collectorServerApi;
  },
};

contextBridge.exposeInMainWorld('collectorServerApi', collectorServerApi);
