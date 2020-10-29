import { SERVER } from './config.js'

const viewModeConfKey = 'CONF/VIEW/MODE'
const viewScopeConfKey = 'CONF/VIEW/SCOPE'
const fontSizeConfKey = 'CONF/FONT/SIZE'
const tokenConfKey = 'CONF/TOKEN'

// TODO clear thirdparty data and rebuild localStorage

export function saveViewMode(mode) {
    localStorage.setItem(viewModeConfKey, mode)
}

export function getViewMode() {
    // entry feed
    return localStorage.getItem(viewModeConfKey) || 'feed'
}

export function saveViewScope(scope) {
    localStorage.setItem(viewScopeConfKey, scope)
}

export function getViewScope() {
    // all unread
    return localStorage.getItem(viewScopeConfKey) || 'all'
}

export function saveFontSize(size) {
    return localStorage.setItem(fontSizeConfKey, size)
}
export function getFontSize() {
    return localStorage.getItem(fontSizeConfKey) || 'text-medium'
}

export function getToken() {
    return localStorage.getItem(tokenConfKey)
}

export async function getTokenPromise() {
    // await new Promise(r => setTimeout(r, 1000*1000));

    let token = localStorage.getItem(tokenConfKey)

    if (!token) {
        const { v4: uuidv4 } = require('uuid');
        let formData = new FormData();
        formData.append('uuid', uuidv4());

        // TODO  sign
        const rsp = await fetch((new URL('/api/get/token', SERVER)).href, {method:'POST', body: formData})
        token = (await rsp.json())['token']

        if (token) {
            localStorage.setItem(tokenConfKey, token)
        }
    }
    return token
}

export function saveObj(key, obj) {
    return localStorage.setItem(key, JSON.stringify(obj))
}
export function getObj(key) {
    return JSON.parse(localStorage.getItem(key))
}
