import { ipcMain } from 'electron';
import { v4 as uuid } from 'uuid';
import ipc from 'node-ipc';
import { IpcMessage, IpcMessageHandlers, IpcMessageType, NodeIpcClient } from './types';

declare global {
  interface Window {
    ipcConnect(): Promise<NodeIpcClient>;
  }
}

interface ReplyHandler {
  resolve(...args: unknown[]): void;
  reject(error: any): void;
}

export class IpcClient<S extends IpcMessageHandlers, C extends IpcMessageHandlers> {
  private queue: string[] = [];
  private client: NodeIpcClient | null = null;

  constructor(private handlers: C) {

  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      window.ipcConnect()
        .then((client) => {
          client.on('message', (data) => {
            this.receive(data);
          });

          client.on('connect', () => {
            this.client = client;
            this.processQueue();
            resolve();
          });

          client.on('disconnect', () => {
            this.client = null;
          });
        });
    });
  }

  private processQueue() {
    this.queue.forEach((message) => {
      this.client?.emit('message', JSON.stringify(message));
    });
    this.queue = [];
  }

  private replyHandlers = new Map<string, ReplyHandler>();

  private receive(json: string) {
    const message = JSON.parse(json) as IpcMessage<C>;

    switch (message.type) {
      case IpcMessageType.error:
      case IpcMessageType.reply:
        this.handleReply(message)
        break;
      case IpcMessageType.push:
        this.handlePush(message);
        break;
      default:
        console.warn('Unknown message type:', message.type);
        break;
    }
  }

  private handleReply(message: IpcMessage<C>) {
    const handler = this.replyHandlers.get(message?.id || '');
    if (handler) {
      const method = message.type === IpcMessageType.error ? 'reject' : 'resolve';
      const payload = message.type === IpcMessageType.error ? message.payload[0] : message.payload;
      handler[method](payload);
      this.replyHandlers.delete(message?.id || '');
    }
  }

  private async handlePush(message: IpcMessage<C>) {
    const handler = this.handlers[message.type];
    const result = await handler(...message.payload);
    if (typeof result !== 'undefined') {
      this.sendMessage(IpcMessageType.reply, message.name, result as never);
    }
  }

  private sendMessage<T extends S | C, R = void>(type: IpcMessageType, name: keyof T, ...payload: never[]): Promise<R> {
    return new Promise((resolve, reject) => {
      const message: IpcMessage<T> = {
        type,
        name,
        payload,
      };
      if (type === IpcMessageType.push) {
        message.id = uuid();
        this.replyHandlers.set(message.id, { resolve, reject });
      }
      if (this.client) {
        this.client.emit('message', JSON.stringify(message));
      } else {
        this.queue.push(JSON.stringify(message))
      }
    });
  }

  send<R = void>(name: keyof S, ...payload: never[]): Promise<R> {
    return this.sendMessage(IpcMessageType.push, name, ...payload);
  }
}
