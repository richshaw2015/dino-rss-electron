import { SERVER } from './config.js'

const viewModeConfKey = 'CONF/VIEW/MODE'
const viewScopeConfKey = 'CONF/VIEW/SCOPE'
const fontSizeConfKey = 'CONF/FONT/SIZE'
const tokenConfKey = 'CONF/TOKEN'

export function toggleViewMode() {
    const viewMode = getViewMode();

    if (viewMode === 'entry') {
        localStorage.setItem(viewModeConfKey, 'feed');
        return 'feed'
    } else {
        localStorage.setItem(viewModeConfKey, 'entry');
        return 'entry'
    }
}

export function getViewMode() {
    const viewMode = localStorage.getItem(viewModeConfKey)

    if (viewMode === null) {
        localStorage.setItem(viewModeConfKey, 'entry');
        return 'entry'
    } else {
        return viewMode;
    }
}

export function toggleViewScope() {
    const viewScope = getViewScope();

    if (viewScope === 'all') {
        localStorage.setItem(viewScopeConfKey, 'unread');
        return 'unread'
    } else {
        localStorage.setItem(viewScopeConfKey, 'all');
        return 'all'
    }
}

export function getViewScope() {
    const viewScope = localStorage.getItem(viewScopeConfKey)

    if (viewScope === null) {
        localStorage.setItem(viewScopeConfKey, 'all');
        return 'all'
    } else {
        return viewScope;
    }
}

export function setFontSize(size) {
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
