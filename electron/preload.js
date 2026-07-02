const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  scanDirectory: (dir) => ipcRenderer.invoke('scan-directory', dir),
  getAudioMetadata: (path) => ipcRenderer.invoke('get-audio-metadata', path),
  savePlaylist: (data) => ipcRenderer.invoke('save-playlist', data),
  loadPlaylist: (path) => ipcRenderer.invoke('load-playlist', path)
});
