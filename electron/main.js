const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true
    },
    titleBarStyle: 'hiddenInset',
    frame: true
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
    
    // Log when page loads
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('Page loaded successfully');
    });
    
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorCode, errorDescription);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for local file access
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result;
});

ipcMain.handle('scan-directory', async (event, directoryPath) => {
  const audioFiles = [];
  const extensions = ['.mp3', '.flac', '.wav', '.m4a', '.ogg', '.aac'];
  
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (extensions.includes(path.extname(file).toLowerCase())) {
        audioFiles.push({
          path: fullPath,
          name: file,
          size: stat.size
        });
      }
    }
  }
  
  try {
    scanDir(directoryPath);
    return audioFiles;
  } catch (error) {
    console.error('Error scanning directory:', error);
    return [];
  }
});

ipcMain.handle('get-audio-metadata', async (event, filePath) => {
  // Basic metadata extraction - in production, use a library like music-metadata
  const stats = fs.statSync(filePath);
  return {
    path: filePath,
    name: path.basename(filePath),
    size: stats.size,
    modified: stats.mtime
  };
});

ipcMain.handle('save-playlist', async (event, playlistData) => {
  const { filePath, content } = playlistData;
  try {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-playlist', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
});
