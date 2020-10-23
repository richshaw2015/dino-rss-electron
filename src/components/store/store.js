import { writable } from 'svelte/store'
import { getViewMode, getViewScope } from '../utils/storage.js'

export let statusMsg = writable("")

export let activeTab = writable("rss")

export let viewMode = writable(getViewMode())

export let viewScope = writable(getViewScope())
