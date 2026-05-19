const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function getSavePath() {
  return path.join(app.getPath('userData'), 'philips-garden-save.json');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // allow loading local file:// images
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1e3a1e',
    title: "Philip's Garden",
    resizable: true,
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('game:load', () => {
  const savePath = getSavePath();
  if (fs.existsSync(savePath)) {
    try {
      return JSON.parse(fs.readFileSync(savePath, 'utf8'));
    } catch {
      return null;
    }
  }
  return null;
});

ipcMain.handle('game:save', (_event, data) => {
  fs.writeFileSync(getSavePath(), JSON.stringify(data, null, 2));
  return true;
});
