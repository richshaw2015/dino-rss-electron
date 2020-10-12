const {app, BrowserWindow, ipcMain, systemPreferences, shell, dialog, clipboard} = require('electron');
const fs = require('fs')

const production = !process.env.ELECTRON_RELOAD;

if (!production) {
	const path = require('path');
	require('electron-reload')(__dirname, {
		electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
		awaitWriteFinish: true,
	});
}

let mainWindow;

// handle webContents events
function openUrlInDefaultBrowser(event, url) {
	if(url !== mainWindow.webContents.getURL()) {
		event.preventDefault()
		shell.openExternal(url)
	}
}

function createMainWindow () {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		minWidth: 1080,
		minHeight: 640,
		center: true,
		titleBarStyle: 'hidden',
		frame: false,
		trafficLightPosition: {x: 9, y: 16},
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			worldSafeExecuteJavaScript: true
		},
		icon: 'public/icon/icon.svg',
		backgroundColor: '#f3f3f3'
	});

	mainWindow.loadFile('public/index.html');

	mainWindow.on('closed', function () {
		mainWindow = null
	});
	mainWindow.on('maximize', () => {
		mainWindow.webContents.send('maximize-window', '')
    })
    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('unmaximize-window', '')
    })

	mainWindow.webContents.on('will-navigate', openUrlInDefaultBrowser)
	mainWindow.webContents.on('new-window', openUrlInDefaultBrowser)

	mainWindow.webContents.on('found-in-page', (event, result) => {
		mainWindow.webContents.send('found-in-page-content', result)
	})

	if (!production) mainWindow.webContents.openDevTools()
}

// handle app events
app.on('ready', createMainWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
})

app.on('activate', function () {
	if (mainWindow === null) createMainWindow();
})

// handle ipc messages
ipcMain.handle('toggle-maximize-window', (event) => {
	if(!mainWindow) return;
	if(process.platform === 'darwin') {
	    const action = systemPreferences.getUserDefault('AppleActionOnDoubleClick', 'string');
	    if(action === 'None') return;
	    if(action === 'Minimize') return mainWindow.minimize();
	}
	if (mainWindow.isMaximized()) return mainWindow.unmaximize();
	return mainWindow.maximize();
})

ipcMain.handle('close-window', (event) => {
	if(!mainWindow) return;
	return mainWindow.close();
})

ipcMain.handle('minimize-window', (event) => {
	if(!mainWindow) return;
	return mainWindow.minimize();
})

ipcMain.handle('capture-window', (event) => {
	mainWindow.webContents.capturePage().then(image => {
		// copy to clipboard, then save to file
		const options = { 
			defaultPath: app.getPath("pictures"),
			filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] }]
		}
		dialog.showSaveDialog(options).then((result) => {
			if (result.filePath) {
				clipboard.writeImage(image)

				fs.writeFileSync(result.filePath, image.toPNG(), (e) => {
					console.log(e)
				})
			}
		})
	})
})