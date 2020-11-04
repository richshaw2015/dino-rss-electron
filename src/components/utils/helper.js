
export function toast(msg) {
    M.toast({html: msg, displayLength: 3000});
}

export function warnToast(msg) {
    const html = '<span style="color: #eeff41;">' + msg + '</span>';
    M.toast({html: html, displayLength: 4500});
}

export function shortToast(msg) {
    M.toast({html: msg, displayLength: 1500});
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

export function reloadWindow() {
    remote.getCurrentWindow().reload()
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

export function getPageSize(isFeedEntriesView=false) {
    if (isFeedEntriesView) {
        return Math.floor((window.innerHeight - 60 - 16 - 60 - 48) / 59)
    } else {
        return Math.floor((window.innerHeight - 60 - 16 - 60) / 59)
    }
}

export function fromNow(utcTs) {
    if (!utcTs) {
        return "Null"
    }

    const nowUtcTs = new Date().getTime() / 1000 | 0
    const seconds = nowUtcTs - utcTs

    let interval = seconds / 31536000 | 0
    if (interval > 1) {
        return interval + " years ago"
    } else if (interval === 1) {
        return "Last year"
    }

    interval = seconds / 2678400 | 0
    if (interval > 1) {
        return interval + " months ago"
    } else if (interval === 1) {
        return "Last month"
    }

    interval = seconds / 604800 | 0
    if (interval > 1) {
        return interval + " weeks ago"
    } else if (interval === 1) {
        return "Last week"
    }

    interval = seconds / 86400 | 0
    if (interval > 1) {
        return interval + " days ago"
    } else if (interval === 1) {
        return "Yesterday"
    }

    interval = seconds / 3600 | 0
    if (interval > 1) {
        return interval + " hours ago"
    } else if (interval === 1) {
        return "An hour ago"
    }

    interval = seconds / 60 | 0
    if (interval > 1) {
        return interval + " minutes ago"
    } else if (interval === 1) {
        return "A minute ago"
    }

    interval = seconds
    if (interval > 10) {
        return interval + " seconds ago"
    } else {
        return "Just now"
    }

    return utcTs
}

export function isInList(item, list) {
    if (item && list) {
        for (let i of list) {
            if (item.id === i.id) {
                return true
            } 
         }
    }
    return false
}

export function resizeImageUrl(image, size=128) {
    try {
        let url = new URL(image)
        if (url.host.indexOf("github") > 0) {
            let params = new URLSearchParams(url.search)
            params.set("s", size)
            url.search = params.toString()
            return url.href
        }
    } catch (e) {}

    return image
}
