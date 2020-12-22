
export function toast(msg, ttl=3000) {
    M.toast({html: msg, displayLength: ttl});
}

export function warnToast(msg) {
    msg = '<span style="color: #eeff41;">' + msg + '</span>'
    toast(msg, 4500)
}

export function shortToast(msg) {
    toast(msg, 1500)
}

export function truncateStr(str, len) {
    return str.length < len ? str : str.slice(0, len) + '...'
}

const { ipcRenderer, remote, clipboard } = require('electron')
const { Menu, MenuItem } = remote
const path = require('path')

export const appVersion = () => {
    return remote.app.getVersion()
}
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
export const toggleDevTools = () => {
    ipcRenderer.invoke('toggle-dev-tools')
}

export function reloadWindow() {
    remote.getCurrentWindow().reload()
}

export function macNavCtxMenu() {
    // this context menu only works on Mac OS
    if (!isMac()) {
        return false
    }
  
    const menu = new Menu();

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
        label: "🔨  Inspect"
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
export function getPlatform() {
    if (isWin()) {
        return 'win'
    } else if (isMac()) {
        return 'mac'
    }
}
export function setBadge(count) {
    if (isMac()) {
        remote.app.dock.setBadge(readableCount(count))
    }
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

export function readableCount(count) {
    if (count < 1000) {
        return count.toString()
    } else {
        if (count < 10000) {
            return Math.floor(count / 1000) + 'K+'
        } else if (count < 100000) {
            return Math.floor(count / 10000) + 'W+'
        } else {
            return '···'
        }
    }
}

export function readableSize(size) {
    if (size >= 1024*1024*1024) {
        return (size / (1024*1024*1024)).toFixed(1) + ' GB'
    } else if (size >= 1024*1024) {
        return (size / (1024*1024)).toFixed(1) + ' MB'
    } else if (size >= 1024) {
        return (size / 1024).toFixed(1) + ' KB'
    } else if (size > 0) {
        return size + ' Bytes'
    } else {
        return "🎉🎉🎉"
    }
}

export function readableAuthor(author) {
    return author.split(' (noreply')[0]
}

export function isInList(item, list) {
    // TODO struct valid
    if (item && list) {
        for (let i of list) {
            if (item.id === i.id && Object.keys(item).toString() === Object.keys(i).toString()) {
                console.log("in list")
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

export function copyToClipboard(text) {
    clipboard.writeText(text)
    shortToast("Copied")
}

export function getCacheDir() {
    return path.join(remote.app.getPath('temp'), remote.app.getName(), "cache")
}
