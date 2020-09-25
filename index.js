const {app, BrowserWindow} = require('electron');

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
		width: 1170,
		height: 720,
		minWidth: 970,
		minHeight: 600,
		titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: true
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
