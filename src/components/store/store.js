import { writable } from 'svelte/store'
import { getViewMode, getViewScope } from '../utils/storage.js'

// nav tab
export let activeTab = writable("rss")

// toolbar button status
export let viewMode = writable(getViewMode())
export let viewScope = writable(getViewScope())

// current active entry
export let activeEntry = writable({})

// /api/entry/get/content
export let entryContentRsp = writable({})

export let listRspBak = writable({})
