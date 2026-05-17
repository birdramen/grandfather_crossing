const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('gameAPI', {
  loadGame: () => ipcRenderer.invoke('game:load'),
  saveGame: (data) => ipcRenderer.invoke('game:save', data),
});
