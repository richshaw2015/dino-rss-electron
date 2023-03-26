const {app, BrowserWindow, ipcMain, systemPreferences, shell, dialog, clipboard, Menu, nativeTheme, screen} = require('electron')
const fs = require('fs')

const DEV = !app.isPackaged
const remoteMain = require("@electron/remote/main");
const { PassThrough } = require('stream');
const path = require('path');
remoteMain.initialize()

if (DEV) {
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
	const workAreaSize = screen.getPrimaryDisplay().workAreaSize
	// auto set window size
	const rows1 = Math.floor((workAreaSize.height * 0.9 - 136) / 59)
	const rows = rows1 > 16 ? 16 : rows1

	const height = 59 * rows + 136
	const width1 = Math.round(height / 0.5625)
	const width2 = 0.95 * workAreaSize.width
	const width = width1 < width2 ? width1 : width2

	mainWindow = new BrowserWindow({
		width: width,
		height: height,
		minWidth: 1080,
		minHeight: 667,
		center: true,
		titleBarStyle: 'hidden',
		frame: false,
		trafficLightPosition: {x: 6, y: 16},
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		},
		icon: path.join(__dirname, '/public/icon/logo.png'),
		backgroundColor: '#f3f3f3',
		show: false,
		autoHideMenuBar: true,
	});

	remoteMain.enable(mainWindow.webContents);

	mainWindow.loadFile('public/index.html');

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	ipcMain.handle('toggle-appearance', (event, mode) => {
		nativeTheme.themeSource = mode;
	})

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

function createAuthWindow(token, sdk) {
	if (mainWindow) {
		mainWindow.webContents.send('loading-login-window', {});
	}

	let authUrl = ""
	if (sdk === "github") {
		authUrl = `https://github.com/login/oauth/authorize?client_id=d7e9908669cff42cdbc8&allow_signup=false&state=${token}`
	} else if (sdk === "google") {
		if (DEV) {
			authUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Foauth%2Fgoogle%2Fcallback&prompt=consent&response_type=code&client_id=174849857390-dsj5k713qmivd1h5c8tl4dlu0emvtg3f.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&access_type=offline&state=${token}`
		} else {
			authUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fdinorss.org%2Fapi%2Foauth%2Fgoogle%2Fcallback&prompt=consent&response_type=code&client_id=174849857390-dsj5k713qmivd1h5c8tl4dlu0emvtg3f.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&access_type=offline&state=${token}`
		}
	} else if (sdk === "apple") {
		authUrl = `https://appleid.apple.com/auth/authorize?response_type=code&redirect_uri=https%3A%2F%2Fdinorss.org%2Fapi%2Foauth%2Fapple%2Fcallback&client_id=org.dinorss.apple.login.service&state=${token}&scope=name%20email&response_mode=form_post`
	}
	if (authUrl === "") {
		return
	}

	authWindow = new BrowserWindow({
		width: 480, 
		height: 640,
		titleBarStyle: 'hidden',
		resizable: false,
		movable: false,
		frame: false,
		trafficLightPosition: {x: 6, y: 16},
		parent: mainWindow,
		modal: true,
		icon: path.join(__dirname, '/public/icon/logo.png'),
		backgroundColor: '#f3f3f3',
		show: false,
	})

	remoteMain.enable(authWindow.webContents);

	authWindow.loadURL(authUrl)

	authWindow.once('ready-to-show', () => {
		if (mainWindow) {
			mainWindow.webContents.send('finish-login-window', {})
		}
		authWindow.show()
	})
	authWindow.on('closed', () => {
		authWindow = null
		if (mainWindow) {
			mainWindow.webContents.send('finish-login-window', {})
		}
	})
	authWindow.webContents.on('did-finish-load', function() {
		authWindow.webContents.insertCSS('body{ overflow: hidden !important; }')
   	})

	// authWindow.webContents.openDevTools()
	authWindow.webContents.on('will-redirect', function(event, url) {
		// back to homepage, success or fail ?
		if (new URL(url).pathname === "/") {
			if (mainWindow) {
				mainWindow.webContents.send('finish-login-window', {})
				mainWindow.webContents.send('login-status-changed')
			}
			event.preventDefault()
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

ipcMain.handle('show-login-window', (event, obj) => {
	createAuthWindow(obj.token, obj.sdk)
})

ipcMain.handle('image-mode-change', (event, mode) => {
	const { session } = require('electron')
	const filter = {urls: []}

	session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
		if (!mode && details.resourceType === 'image') {
			if (details.url.startsWith('http') && !details.url.startsWith('https://favicon-') &&
				!details.url.startsWith('https://avatars.githubusercontent.com/')) {
				callback({ cancel: true })
				return
			}
		}
		callback({})
	})
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

if (process.platform === 'darwin') {
	const template = [
		{ role: 'appMenu' },
		{ role: 'editMenu' },
		// { role: 'viewMenu' },
		{
			label: 'View',
			submenu: [
				{ role: 'togglefullscreen' }
			]
		},
		{ role: 'windowMenu' },
		{
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click: async () => {
						await shell.openExternal('https://github.com/richshaw2015/dino-rss-electron')
					}
				}
			]
		}
	];

	menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}