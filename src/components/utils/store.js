import { writable } from 'svelte/store'
import { getRssViewMode, getViewScope, getUserInfo, getStarViewMode } from './storage.js'

// nav tab
export let activeTab = writable("rss")

// toolbar button status
export let rssViewMode = writable(getRssViewMode())
export let starViewMode = writable(getStarViewMode())

export let viewScope = writable(getViewScope())

export let userInfoRsp = writable(getUserInfo())
export let unreadCountRsp = writable(0)

export let isApiLoading = writable(false)

// rss tab
export let rssEntryListRsp = writable({})
export let rssFeedListRsp = writable({})
export let rssEntryContentRsp = writable({})
export let rssActiveEntry = writable({})
export let rssActiveFeed = writable({})
export let rssFeedEntriesView = writable(false)

// star tab
export let starEntryListRsp = writable({})
export let starFeedListRsp = writable({})
export let starEntryContentRsp = writable({})
export let starActiveEntry = writable({})
export let starActiveFeed = writable({})
export let starFeedEntriesView = writable(false)
