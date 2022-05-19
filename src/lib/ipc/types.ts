import { AddressInfo, Socket } from 'net';
import { TelemetryDataArray } from 'forza-open-telemetry-server';

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
  telemetry(data: TelemetryDataArray): Promise<void>;
  collectorClosed(reason: string): Promise<void>;
}

export interface TelemetryIpcServer extends IpcMessageHandlers {
  startCollector(): Promise<AddressInfo>;
  stopCollector(): Promise<boolean>;
  restartCollector(): Promise<AddressInfo>;
  isRunning(): Promise<boolean>;
  setPort(port: number): Promise<boolean>;
}

// Included here because you can't import it from the @types/node-ipc
export interface NodeIpcClient {
  /**
   * triggered when a JSON message is received. The event name will be the type string from your message
   * and the param will be the data object from your message eg : { type:'myEvent',data:{a:1}}
   */
  on(event: string, callback: (...args: any[]) => void): NodeIpcClient;
  /**
   * triggered when an error has occured
   */
  on(event: "error", callback: (err: any) => void): NodeIpcClient;
  /**
   * connect - triggered when socket connected
   * disconnect - triggered by client when socket has disconnected from server
   * destroy - triggered when socket has been totally destroyed, no further auto retries will happen and all references are gone
   */
  on(event: "connect" | "disconnect" | "destroy", callback: () => void): NodeIpcClient;
  /**
   * triggered by server when a client socket has disconnected
   */
  on(event: "socket.disconnected", callback: (socket: Socket, destroyedSocketID: string) => void): NodeIpcClient;
  /**
   * triggered when ipc.config.rawBuffer is true and a message is received
   */
  on(event: "data", callback: (buffer: Buffer) => void): NodeIpcClient;
  emit(event: string, value?: any): NodeIpcClient;
  /**
   * Unbind subscribed events
   */
  off(event: string, handler: any): NodeIpcClient;
}
