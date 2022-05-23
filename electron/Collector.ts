import * as dgram from 'dgram';
import { AddressInfo } from 'net';
// const server = dgram.createSocket('udp4');

// server.on('error', (err) => {
//   console.log('server error: ', err);
//   server.close();
// });

// server.on('message', (msg, rinfo) => {
//   console.log(`recieved message with length ${msg.length} from ${rinfo.address}:${rinfo.port}`);
// });

// server.on('listening', () => {
//   const address = server.address();
//   console.log(`server listening ${address.address}:${address.port}`);
// });

// server.bind(69420);

// server.close();

type MessageHandler = (msg: Buffer, rinfo: dgram.RemoteInfo) => void;

class Collector {
  private server = dgram.createSocket('udp4');
  private _address: AddressInfo | null = null;
  private running = false;

  constructor(private port: number, messageHandler: MessageHandler) {
    this.server.on('error', (err) => {
      console.log('server error: ', err);
      this.server.close();
    });
    this.server.on('message', messageHandler);
    this.server.on('listening', () => {
      this.running = true;
      this._address = this.server.address();
      console.log(`Collector listening on ${this._address.address}:${this._address.port}`);
    })
    this.server.on('close', () => {
      this.running = false;
      console.log('Collector stopped');
    })
  }

  address() {
    return this._address ? { ...this._address } : null;
  }

  isRunning() {
    return this.running;
  }

  async start() {
    return new Promise<AddressInfo>((resolve, reject) => {
      try {
        this.server.bind(this.port, () => {
          resolve(this.server.address());
        });
      } catch (error) {
        reject(error);
      }
    })
  }

  async stop() {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.server.close(() => {
          resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async setPort(port: number) {
    const wasRunning = this.running;
    if (this.running) {
      await this.stop();
    }
    this.port = port;
    if (wasRunning) {
      await this.start();
    }
    return true;
  }
}

export default Collector;
