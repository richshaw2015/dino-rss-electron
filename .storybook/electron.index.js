const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
const { app, BrowserWindow } = require('electron')
const Telnet = require('telnet-client')

let mainWindow

app.commandLine.appendSwitch('disable-web-security')
app.commandLine.appendSwitch('remote-debugging-port', '5858')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function waitUntilLoadUrl() {
    let connection = new Telnet()
    let params = {
        host: '127.0.0.1',
        port: 12315,
        shellPrompt: false,
        negotiationMandatory: false,
        timeout: 2000
    }
    for (let i = 0; i < 100; i++) {
        try {
            await connection.connect(params)
            mainWindow.loadURL('http://localhost:12315')
            break
        } catch(error) {
            await sleep(300)
        }
    }
}

waitUntilLoadUrl()

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            webviewTag: false,
            sandbox: false,
            allowRunningInsecureContent: true,
            offscreen: false,
            webSecurity: false,
            contextIsolation: false,
            zoomFactor: 1.2
        },
    })

    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
})