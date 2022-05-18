import { AddressInfo } from 'net';
import { TelemetryDataRow } from './types';

export enum IpcMessageType {
  reply,
  error,
  push,
}

export interface IpcMessage<T> {
  type: IpcMessageType;
  name: keyof T;
  payload: any[];
  id?: string;
}

export type IpcMessageHandler = (...args: any[]) => Promise<unknown>;
export type IpcMessageHandlers = Record<string, IpcMessageHandler>;

export interface TelemetryIpcClient extends IpcMessageHandlers {
  telemetry(data: TelemetryDataRow): Promise<void>;
  collectorClosed(reason: string): Promise<void>;
}

export interface TelemetryIpcServer extends IpcMessageHandlers {
  startCollector(): Promise<AddressInfo>;
  stopCollector(): Promise<boolean>;
  restartCollector(): Promise<AddressInfo>;
  isRunning(): Promise<boolean>;
  setPort(port: number): Promise<boolean>;
}
