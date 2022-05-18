import { networkInterfaces, hostname } from 'os';
import * as dns from 'dns';
import * as dgram from 'dgram';

const nets = networkInterfaces();
const results: Record<string, string[]> = {}; // Or just '{}', an empty object

dns.lookup(hostname(), (err, add, fam) => {
  console.log('IP Address', add);
});

Object.keys(nets).forEach((name) => {
  const interfaceInfo = nets[name];
  if (interfaceInfo) {
    interfaceInfo.forEach((net) => {
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    })
  }
});

console.log(results);

// const server = dgram.createSocket('udp4');
// server.on('error', (err) => {
//   console.log('server error: ', err);
//   server.close();
// });
// server.on('listening', () => {
//   const address = server.address();
//   console.log(`Collector listening on ${address.address}:${address.port}`);
// });
// server.on('close', () => {
//   console.log('Collector stopped');
// });
// server.bind(54321);
