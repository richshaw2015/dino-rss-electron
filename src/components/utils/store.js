import { writable } from 'svelte/store'
import { getViewMode, getViewScope, getUserInfo } from './storage.js'

// nav tab
export let activeTab = writable("rss")

// toolbar button status
export let viewMode = writable(getViewMode())
export let viewScope = writable(getViewScope())

export let userInfoRsp = writable(getUserInfo())

export let unreadCountRsp = writable(0)

// rss tab
export let rssListRsp = writable({})
export let rssFeedListRsp = writable({})
export let rssEntryContentRsp = writable({})
export let rssActiveEntry = writable({})
export let rssActiveFeed = writable({})
export let rssFeedEntriesView = writable(false)

// star tab
export let starListRsp = writable({})
export let starFeedListRsp = writable({})
export let starEntryContentRsp = writable({})
export let starActiveEntry = writable({})
export let starActiveFeed = writable({})
export let starFeedEntriesView = writable(false)
