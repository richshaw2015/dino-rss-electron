import { localeLangConfKey, tokenConfKey } from './storage.js'
import { localeMsg, tagImgMap } from './constant.js'
import {SERVER} from "./config";

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

const { ipcRenderer, clipboard } = require('electron')

const remote = require('@electron/remote');

const { Menu, MenuItem } = remote
const path = require('path')
const fs = require('fs')

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

    // menu.append(new MenuItem({
    //     label: "🔎  Zoom",
    //     submenu: [
    //         {"role": "resetZoom"},
    //         {"role": "zoomIn"},
    //         {"role": "zoomOut"},
    //     ]
    // }));
    // menu.append(new MenuItem({type: "separator",}));

    // menu.append(new MenuItem({
    //     role: "toggleDevTools",
    //     visible: !process.mas,
    //     label: "🔨  Inspect"
    // }));
    // menu.append(new MenuItem({type: "separator",}));
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

export function isLinux(){
    return process.platform === 'linux'
}

export function getPlatform() {
    if (isWin()) {
        return 'win'
    } else if (isMac()) {
        return 'mac'
    } else if (isLinux()) {
        return 'linux'
    }
}

export function getArch() {
    return process.arch
}

export function setBadge(count) {
    if (isMac()) {
        remote.app.dock.setBadge(readableCount(count))
    } else if (isWin()) {
        if (count > 0 && !remote.getCurrentWindow().isFocused()) {
            remote.getCurrentWindow().flashFrame(true)
        }
    } else {
        remote.app.setBadgeCount(count)
    }
}
export function getPageSize(isFeedEntriesView=false) {
    if (isFeedEntriesView) {
        return Math.floor((window.innerHeight - 50 - 16 - 42 - 48) / 59)
    } else {
        return Math.floor((window.innerHeight - 50 - 28 - 16 - 42) / 59)
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
        return interval + i18n("years.ago")
    } else if (interval === 1) {
        return i18n("last.year")
    }

    interval = seconds / 2678400 | 0
    if (interval > 1) {
        return interval + i18n("months.ago")
    } else if (interval === 1) {
        return i18n("last.month")
    }

    interval = seconds / 604800 | 0
    if (interval > 1) {
        return interval + i18n("weeks.ago")
    } else if (interval === 1) {
        return i18n("last.week")
    }

    interval = seconds / 86400 | 0
    if (interval > 1) {
        return interval + i18n("days.ago")
    } else if (interval === 1) {
        return i18n("yesterday")
    }

    interval = seconds / 3600 | 0
    if (interval > 1) {
        return interval + i18n("hours.ago")
    } else if (interval === 1) {
        return i18n("last.hour")
    }

    interval = seconds / 60 | 0
    if (interval > 1) {
        return interval + i18n("minutes.ago")
    } else if (interval === 1) {
        return i18n("last.minute")
    }

    interval = seconds
    if (interval > 10) {
        return interval + i18n("seconds.ago")
    } else {
        return i18n("just.now")
    }

    return utcTs
}

export function readableCount(count) {
    if (count === 0) {
        return ''
    }
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

export function fixAvatarUrl(image, uid, size=128) {
    if (!image) {
        const idx = uid.toString().slice(-1)
        return `icon/avatar/${idx}.png`
    }

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
}

export function getCacheDir() {
    return path.join(remote.app.getPath('userData'), "APPCache")
}

export function getAppVer() {
    return remote.app.getVersion()
}

export function setEntryCache(entryId, cacheRsp) {
    const entryCacheDir = getCacheDir()
    const entryCacheFile = path.join(entryCacheDir, entryId + ".json")
    fs.writeFileSync(entryCacheFile, JSON.stringify(cacheRsp), {encoding: "utf8"})
}

export function getLocaleLang() {
    let lang = localStorage.getItem(localeLangConfKey)
    if (!lang) {
        lang = remote.app.getLocale()
    }
    if (!["zh", "zh-TW", "zh-CN", "zh-HK", "en", "ja", "ko"].includes(lang)){
        lang = "en"
    } else {
        if (lang === "zh-CN") {
            lang = "zh"
        } else if (lang === "zh-HK") {
            lang = "zh-TW"
        }
    }
    console.log(lang)
    return lang
}

// locale lang
export const localeLang = getLocaleLang()

export function i18n(msg) {
    return localeMsg[msg][localeLang]
}

export function calTagCountMap(tagMap) {
    let destMap = {}
    for (let feed in tagMap) {
        let tag = tagMap[feed]
        destMap[tag] = (destMap[tag] || 0) + 1
    }
    return destMap
}

export function getTagSrc(tag) {
    return tagImgMap[tag]
}

export function  convHtml(src) {
    return src.replaceAll('<', "&lt;");
    // return src.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    //     .replaceAll("&", "&amp;").replaceAll('"', "&quot;")
}

export async function getTokenPromise() {
    let token = localStorage.getItem(tokenConfKey)

    if (!token) {
        const md5 = require('md5')

        const uuid = uuidv4()
        const random = Math.floor(Math.random() * 100000000)
        const sign = md5(`${uuid} ${random}`)
        const lang = getLocaleLang()

        let formData = new FormData()
        formData.append('uuid', uuid)
        formData.append('random', random)
        formData.append('sign', sign)
        formData.append('lang', lang)

        const rsp = await fetch((new URL('/api/user/token', SERVER)).href, {method:'POST', body: formData})
        token = (await rsp.json())['token']

        if (token) {
            localStorage.setItem(tokenConfKey, token)
        }
    }
    return token
}