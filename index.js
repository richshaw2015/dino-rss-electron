const {app, BrowserWindow, ipcMain, systemPreferences, shell, dialog, clipboard} = require('electron')
const fs = require('fs')

const DEV = !app.isPackaged
const remoteMain = require("@electron/remote/main");
remoteMain.initialize()

if (DEV) {
	const path = require('path');
	try {
		require('electron-reload')(__dirname, {
			electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
			awaitWriteFinish: true,
		})
	} catch (e) {}
}

let mainWindow;
let authWindow;
let willQuitMac = false;

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
		height: 726,
		minWidth: 1080,
		minHeight: 640,
		center: true,
		titleBarStyle: 'hidden',
		frame: false,
		trafficLightPosition: {x: 6, y: 16},
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
		icon: 'public/icon/icon.svg',
		backgroundColor: '#f3f3f3'
	});

	remoteMain.enable(mainWindow.webContents);

	mainWindow.loadFile('public/index.html');

	mainWindow.on('close', (event) => {
		if (process.platform === "darwin") {
			if (willQuitMac) {
				mainWindow = null
			} else {
				event.preventDefault()
				mainWindow.minimize()
			}
		}
	})
	mainWindow.on('closed', () => {
		mainWindow = null
	})
	mainWindow.on('maximize', () => {
		mainWindow.webContents.send('maximize-window', '')
    })
    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('unmaximize-window', '')
	})
	
	mainWindow.on('focus', function () {
		if (authWindow) {
			authWindow.close()
		}
		mainWindow.flashFrame(false)
	});

	mainWindow.webContents.on('will-navigate', openUrlInDefaultBrowser)
	mainWindow.webContents.on('new-window', openUrlInDefaultBrowser)

	mainWindow.webContents.on('found-in-page', (event, result) => {
		mainWindow.webContents.send('found-in-page-content', result)
	})

	if (DEV) mainWindow.webContents.openDevTools()
}

function createAuthWindow(token) {
	const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=d7e9908669cff42cdbc8&allow_signup=false&state=${token}`

	authWindow = new BrowserWindow({
		width: 480, 
		height: 640,
		titleBarStyle: 'hidden',
		resizable: false,
		movable: false,
		frame: false,
		trafficLightPosition: {x: 6, y: 16},
		parent: mainWindow,
		icon: 'public/icon/icon.svg'
	})

	remoteMain.enable(authWindow.webContents);

	authWindow.loadURL(githubAuthUrl)

	authWindow.on('closed', () => {
		authWindow = null
	})
	authWindow.webContents.on('did-finish-load', function() {
		authWindow.webContents.insertCSS('body{ overflow: hidden !important; }')
   	})

	// authWindow.webContents.openDevTools()
	authWindow.webContents.on('will-redirect', function(event, url) {
		// back to homepage, success or fail ?
		if (new URL(url).pathname === "/") {
			if (mainWindow) {
				mainWindow.webContents.send('login-status-changed')
			}
			authWindow.hide()
		}
	})
}

// handle app events
app.on('before-quit', () => willQuitMac = true);

app.on('ready', function() {
	createMainWindow()
});

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

ipcMain.handle('toggle-dev-tools', (event) => {
	if(!mainWindow || process.mas) return;
	return mainWindow.webContents.toggleDevTools();
})

ipcMain.handle('minimize-window', (event) => {
	if(!mainWindow) return;
	return mainWindow.minimize();
})

ipcMain.handle('show-login-window', (event, token) => {
	createAuthWindow(token)
})

ipcMain.handle('capture-window', (event) => {
	mainWindow.webContents.capturePage().then(image => {
		// copy to clipboard, then save to file
		const options = { 
			defaultPath: app.getPath("pictures"),
			filters: [{ name: 'Images', extensions: ['png', 'jpg', 'gif', 'jpeg'] }]
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
