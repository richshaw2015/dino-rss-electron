import { writable, readable } from 'svelte/store'
import { getRssViewMode, getViewScope, getUserInfo, getStarViewMode, getFeedTagInfo, getTagCountInfo } from './storage.js'

// nav tab
export let activeTab = writable("rss")

// toolbar button status
export let rssViewMode = writable(getRssViewMode())
export let starViewMode = writable(getStarViewMode())

export let viewScope = writable(getViewScope())

export let userInfoRsp = writable(getUserInfo())
export let unreadCountRsp = writable({})
export let upgradeRsp = writable({})

export let isApiLoading = writable(false)
export let isForceLoading = writable(false)
export let feedToEdit = writable({})

// rss tab
export let rssListRsp = writable({})
export let rssFeedListRspBak = writable({})
export let rssEntryContentRsp = writable({})
export let rssActiveEntry = writable({})
export let rssActiveFeed = writable({})
export let rssFeedEntriesView = writable(false)

// star tab
export let starListRsp = writable({})
export let starFeedListRspBak = writable({})
export let starEntryContentRsp = writable({})
export let starActiveEntry = writable({})
export let starActiveFeed = writable({})
export let starFeedEntriesView = writable(false)

// apps tab
export let appsActiveMenu = writable("update")

export let hourUpdateRsp = writable([])
export let recentAddRsp = writable([])

// tag
export let activeTag = writable(-1)
export let isTagSynced = writable(false)
export let feedTagMap = writable(getFeedTagInfo())
export let tagCountMap = writable(getTagCountInfo())

// article mode
export let readingMode = writable(false)

// Podcast
export let showPodcastMini = writable(false)
export let endPodcastMini = writable(false)
export let podcastMiniInfo = writable({})
