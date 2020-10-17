import { writable } from 'svelte/store';

export let statusMsg = writable("");

export let activeTab = writable("rss");
