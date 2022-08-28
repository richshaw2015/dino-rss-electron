const starViewModeConfKey = 'CONF/STAR/VIEW/MODE'
const rssViewModeConfKey = 'CONF/RSS/VIEW/MODE'

const viewScopeConfKey = 'CONF/VIEW/SCOPE'
const fontSizeConfKey = 'CONF/FONT/SIZE'
export const tokenConfKey = 'CONF/TOKEN'
const userInfoConfKey = 'CONF/USER'

const feed2tagConfKey = 'CONF/FEED/TAG'
const tagCountConfKey = 'CONF/TAG/COUNT'
const imgModeKey = 'CONF/IMG/MODE'
const appearanceModeKey = 'CONF/IMG/APPEARANCE'

export const localeLangConfKey = 'CONF/LOCALE'
export const masVerifyConfKey = 'CONF/MAS/VERIFY'

// TODO clear thirdparty data and rebuild localStorage

export function saveLocaleLang(lang) {
    console.log("Save locale: " + lang)
    localStorage.setItem(localeLangConfKey, lang)
    location.reload()
}

export function saveImgMode(mode) {
    localStorage.setItem(imgModeKey, mode)
}

export function saveAppearanceMode(mode) {
    localStorage.setItem(appearanceModeKey, mode)
}

export function getImgMode() {
    const mode = localStorage.getItem(imgModeKey)
    if (mode === 'false') {
        return false
    }
    return true
}

export function getAppearance() {
    const mode = localStorage.getItem(appearanceModeKey)
    if (mode === 'light' || mode === 'dark') {
        return mode
    }
    return 'system';
}

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
    return localStorage.getItem(viewScopeConfKey) || 'unread'
}

export function saveFeedTagInfo(tag) {
    localStorage.setItem(feed2tagConfKey, JSON.stringify(tag))
}
export function getFeedTagInfo() {
    const tag = localStorage.getItem(feed2tagConfKey)
    if (tag) {
        return JSON.parse(tag)
    }
    return {}
}

export function saveTagCountInfo(tag) {
    localStorage.setItem(tagCountConfKey, JSON.stringify(tag))
}
export function getTagCountInfo() {
    const tag = localStorage.getItem(tagCountConfKey)
    if (tag) {
        return JSON.parse(tag)
    }
    return {}
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

export function setMasVerify(rsp) {
    return localStorage.setItem(masVerifyConfKey, rsp)
}
export function deleteMasVerify() {
    return localStorage.removeItem(masVerifyConfKey)
}
export function isMasVerify() {
    return localStorage.getItem(masVerifyConfKey)
}

export function clearUserInfo() {
    localStorage.removeItem(userInfoConfKey)
    localStorage.removeItem(tokenConfKey)
}
