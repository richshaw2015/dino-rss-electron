
export function toast(msg) {
    M.toast({html: msg, displayLength: 3000});
}

export function warnToast(msg) {
    const html = '<span style="color: #eeff41;">' + msg + '</span>';
    M.toast({html: html, displayLength: 4500});
}

export function truncateStr(str, len) {
    return str.length < len ? str : str.slice(0, len) + '...'
}

const { ipcRenderer } = require('electron')
const { remote } = require('electron')
const { Menu, MenuItem } = remote

export const toggleMaximizeWindow = () => {
    ipcRenderer.invoke('toggle-maximize-window')
}
export const minimizeWindow = () => {
    ipcRenderer.invoke('minimize-window')
}
export const closeWindow = () => {
    ipcRenderer.invoke('close-window')
}
export const captureWindow = () => {
    ipcRenderer.invoke('capture-window')
}

export function macNavCtxMenu() {
    // this context menu only works on Mac OS
    const menu = new Menu();

    menu.append(new MenuItem({
        role: "zoom",
        label: "‍📐  Toggle Window Size"
    }));
    menu.append(new MenuItem({type: "separator"}));

    menu.append(new MenuItem({
        role: "reload",
        label: "🔄  Reload"
    }));
    menu.append(new MenuItem({type: "separator"}));

    menu.append(new MenuItem({
        label: "🔎  Zoom",
        submenu: [
            {"role": "resetZoom"},
            {"role": "zoomIn"},
            {"role": "zoomOut"},
        ]
    }));
    menu.append(new MenuItem({type: "separator",}));
    menu.append(new MenuItem({
        role: "toggleDevTools",
        label: "🔨  Inspect",
        enabled: process.env.ELECTRON_RELOAD
    }));
    menu.append(new MenuItem({type: "separator",}));
    menu.append(new MenuItem({
        role: "windowMenu",
        label: "🔲  Window"
    }));
    menu.popup({ window: remote.getCurrentWindow() })
}

export function isWin(){
    return process.platform === 'win32'
}

export function isMac(){
    return process.platform === 'darwin'
}

export function getPageSize() {
    return Math.floor((window.innerHeight - 60 - 16 - 60) / 59)
}
