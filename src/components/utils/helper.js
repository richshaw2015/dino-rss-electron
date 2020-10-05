

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

export const dblClickTitleBar = () => {
    ipcRenderer.invoke('dblclick-title-bar')
}

export function macNavCtxMenu() {
    // this context menu only works on Mac OS
    const menu = new Menu();

    menu.append(new MenuItem({
        role: "zoom",
        label: "‍📐  Toggle Window Size",
        visible: process.platform === 'darwin'
    }));
    menu.append(new MenuItem({type: "separator"}));

    menu.append(new MenuItem({
        role: "reload",
        label: "🔄  Reload",
        visible: process.platform === 'darwin'
        
    }));
    menu.append(new MenuItem({type: "separator"}));

    menu.append(new MenuItem({
        label: "🔎  Zoom",
        submenu: [
            {"role": "resetZoom"},
            {"role": "zoomIn"},
            {"role": "zoomOut"},
        ],
        visible: process.platform === 'darwin'
    }));
    menu.append(new MenuItem({type: "separator",}));
    menu.append(new MenuItem({
        role: "toggleDevTools",
        label: "🔨  Inspect",
        visible: process.platform === 'darwin',
        enabled: process.env.ELECTRON_RELOAD
    }));
    menu.append(new MenuItem({type: "separator",}));
    menu.append(new MenuItem({
        role: "windowMenu",
        label: "🔲  Window",
        visible: process.platform === 'darwin'
    }));
    menu.popup({ window: remote.getCurrentWindow() })
}