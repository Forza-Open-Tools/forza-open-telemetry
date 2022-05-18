import { app, BrowserWindow } from 'electron';
import { fork } from 'child_process';
import * as path from 'path';
import findOpenSocket from './find-open-socket';

const isDev = process.env.IS_DEV === "true"; // ? true : false;

function createWindow(socketName: string) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'client-preload.js'),
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3333'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('set-socket', {
      name: socketName,
    });
  });

  // mainWindow.webContents.send()
}

function createBackgroundWindow(socketName: string) {
  const win = new BrowserWindow({
    x: 500,
    y: 300,
    width: 700,
    height: 500,
    show: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadURL(`file://${__dirname}/server-dev.html`)

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('set-socket', { name: socketName })
  })

  return win;
}

function createBackgroundProcess(socketName: string) {
  const serverProcess = fork(__dirname + '/server.js', [
    '--subprocess',
    app.getVersion(),
    socketName
  ]);

  serverProcess.on('message', msg => {
    console.log(msg)
  });

  app.on('before-quit', () => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const serverSocket = await findOpenSocket();
  createWindow(serverSocket);
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(serverSocket)
  });

  if (isDev) {
    createBackgroundWindow(serverSocket);
  } else {
    createBackgroundProcess(serverSocket);
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
