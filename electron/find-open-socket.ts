import ipc from 'node-ipc';

ipc.config.silent = true;

function isSocketTaken(name: string) {
  return new Promise((resolve) => {
    ipc.connectTo(name, () => {
      ipc.of[name].on('error', () => {
        ipc.disconnect(name);
        resolve(false);
      });

      ipc.of[name].on('connect', () => {
        ipc.disconnect(name);
        resolve(true);
      });
    });
  });
}

export default async function findOpenSocket() {
  let currentSocket = 1;
  console.log('checking', currentSocket);
  while (await isSocketTaken('myapp' + currentSocket)) {
    currentSocket++;
    console.log('checking', currentSocket);
  }
  console.log('found socket', currentSocket);
  return 'myapp' + currentSocket;
}
