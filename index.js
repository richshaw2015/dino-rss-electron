const {app, BrowserWindow, ipcMain, systemPreferences} = require('electron');

const production = !process.env.ELECTRON_RELOAD;

if (!production) {
	const path = require('path');
	require('electron-reload')(__dirname, {
		electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
		awaitWriteFinish: true,
	});
}

let mainWindow;

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		minWidth: 1080,
		minHeight: 640,
		center: true,
		titleBarStyle: 'hidden',
		trafficLightPosition: {x: 9, y: 16},
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		},
		icon: 'public/icon/icon.svg'
	});

	mainWindow.loadFile('public/index.html');

	mainWindow.on('closed', function () {
		mainWindow = null
	});

	if (!production) mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
})

app.on('activate', function () {
	if (mainWindow === null) createWindow();
})

ipcMain.handle('dblclick-title-bar', (event) => {
	if(!mainWindow) return;
	if(process.platform === 'darwin') {
	    const action = systemPreferences.getUserDefault('AppleActionOnDoubleClick', 'string');
	    if(action === 'None') return;
	    if(action === 'Minimize') return mainWindow.minimize();
	}
	if (mainWindow.isMaximized()) return mainWindow.unmaximize();
	return mainWindow.maximize ();
})