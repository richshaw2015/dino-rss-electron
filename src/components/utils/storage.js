const viewModeConfKey = 'CONF/VIEW/MODE'
const viewScopeConfKey = 'CONF/VIEW/SCOPE'
const fontSizeConfKey = 'CONF/FONT/SIZE'
const uuidConfKey = 'CONF/UUID'

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

export function getUuid() {
    let uuid = localStorage.getItem(uuidConfKey)

    if (uuid === null) {
        const { v4: uuidv4 } = require('uuid');
        uuid = uuidv4()
        localStorage.setItem(uuidConfKey, uuid);
    }
    console.assert(uuid.length === 36, `Initialization UUID Error: ${uuid}`)
    return uuid
}
