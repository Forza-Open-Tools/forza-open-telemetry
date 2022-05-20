import ipc from 'node-ipc';
import { Socket } from 'net';
import { IpcMessageHandlers, IpcMessage, IpcMessageType } from '../src/lib/ipc';

export default class IpcServer<S extends IpcMessageHandlers, C extends IpcMessageHandlers> {
  constructor(socketName: string, private handlers: S) {
    ipc.config.id = socketName;
    ipc.config.silent = true;

    ipc.serve(() => {
      ipc.server.on('message', (message: IpcMessage<S>, socket: Socket) => {
        if (this.handlers[message.name]) {
          this.handlers[message.name](...message.payload)
            .then((result) => {
              if (typeof result !== 'undefined') {
                this.respond(socket, IpcMessageType.reply, message.id, result);
              }
            })
            .catch((error) => {
              this.respond(socket, IpcMessageType.error, message.id, error.message);
            });
        } else {
          const msg = `Unknown event name: ${message.name}`;
          console.warn(msg);
          this.respond(socket, IpcMessageType.error, message.id, msg);
        }
      })
    });
    const server = new ipc.IPC();
    server.config.id
    ipc.serve()
  }

  private respond(socket: Socket, type: IpcMessageType, id: string | undefined, ...data: unknown[]) {
    ipc.server.emit(
      socket,
      'message',
      JSON.stringify({ type, name, id, data }),
    );
  }

  send(name: keyof C, ...payload: any[]) {
    const message: IpcMessage<C> = {
      type: IpcMessageType.push,
      name,
      payload,
    };
    ipc.server.broadcast('message',)
  }
}
