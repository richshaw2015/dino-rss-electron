import { SERVER } from './config.js'

const starViewModeConfKey = 'CONF/STAR/VIEW/MODE'
const rssViewModeConfKey = 'CONF/RSS/VIEW/MODE'

const viewScopeConfKey = 'CONF/VIEW/SCOPE'
const fontSizeConfKey = 'CONF/FONT/SIZE'
const tokenConfKey = 'CONF/TOKEN'
const userInfoConfKey = 'CONF/USER'

// TODO clear thirdparty data and rebuild localStorage

export function saveRssViewMode(mode) {
    localStorage.setItem(rssViewModeConfKey, mode)
}

export function getRssViewMode() {
    return localStorage.getItem(rssViewModeConfKey) || 'feed'
}

export function saveStarViewMode(mode) {
    localStorage.setItem(starViewModeConfKey, mode)
}

export function getStarViewMode() {
    return localStorage.getItem(starViewModeConfKey) || 'entry'
}

export function saveViewScope(scope) {
    localStorage.setItem(viewScopeConfKey, scope)
}

export function getViewScope() {
    // all unread
    return localStorage.getItem(viewScopeConfKey) || 'all'
}

export function saveUserInfo(user) {
    localStorage.setItem(userInfoConfKey, JSON.stringify(user))
}
export function getUserInfo() {
    const user = localStorage.getItem(userInfoConfKey)
    if (user) {
        return JSON.parse(user)
    } else {
        return {
            id: 0,
            level: 1,
            oauth: '',
            name: '',
            image: './icon/logo.svg',
            blog: '',
            stats: {
                star_entries_count: 0,
                sub_feeds_count: 0
            }
        }
    }
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

export function saveToken(token) {
    return localStorage.setItem(tokenConfKey, token)
}

export async function getTokenPromise() {
    // await new Promise(r => setTimeout(r, 1000*1000));

    let token = localStorage.getItem(tokenConfKey)

    if (!token) {
        const { v4: uuidv4 } = require('uuid');
        let formData = new FormData();
        formData.append('uuid', uuidv4());

        // TODO  sign
        const rsp = await fetch((new URL('/api/user/token', SERVER)).href, {method:'POST', body: formData})
        token = (await rsp.json())['token']

        if (token) {
            localStorage.setItem(tokenConfKey, token)
        }
    }
    return token
}
