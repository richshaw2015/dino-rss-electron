<script>
    import FeedItem from '../index/FeedItem.svelte'
    import FeedNav from '../index/FeedNav.svelte'
    import Pager from '../pager/Pager.svelte'
    import Toolbar from '../index/Toolbar.svelte'
    import EntryItem from "../index/EntryItem.svelte";
    import { isWin, getPageSize } from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    import { activeTab } from '../store/store.js'

    export let viewMode = 'feed'
    export let viewScope = 'all'

    export let itemList = []
    export let currentEntry
    export let thirdContent

    export let currentPage = 1
    export let numPages

    let isFeedEntriesView = false

    const { remote } = require('electron');
    const { Menu, MenuItem } = remote;

    import { onMount } from 'svelte';

    onMount(() => {
        const unsubscribe = activeTab.subscribe(switchTab => {
            console.debug(`New tab ${switchTab}`)
            if (switchTab !== 'apps') {
                refreshListView(1)
            }
        })

        return () => unsubscribe()
    })

    function refreshListView(page) {
        if (!page) {
            page = currentPage
        }
        if (viewMode === 'feed') {
            apiReq('/api/my/feeds', {page: page, page_size: getPageSize(), scope: viewScope}).then( rsp => {
                if (rsp.code === 0) {
                    itemList = rsp.data

                    currentPage = rsp.page
                    numPages = rsp.num_pages
                }else {
                    // TODO
                }
            }).catch(err => {
                // TODO
            })
        } else if (viewMode === 'entry') {
            apiReq('/api/my/entries', {page: page, page_size: getPageSize(), scope: viewScope}).then( rsp => {
                if (rsp.code === 0) {
                    itemList = rsp.data
                    currentPage = rsp.page
                    numPages = rsp.num_pages
                }else {
                    // TODO
                }
            }).catch(err => {
                // TODO
            })
        }
    }
    function handleRefreshListView(event) {
        refreshListView(event.detail.page || 1)
    }
    // TODO shortcut n N p P b C r D

    // TODO dynamic read/unread star/unstar menu
    function showFeedCtxMenu() {
        const menu = new Menu();
        menu.append(new MenuItem({
            label: "✅️  Mark Feed as read",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));
        menu.append(new MenuItem({
            label: "🔗  Copy Feed Link",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "✏️  Edit Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🗑  Unsubscribe Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.popup({ window: remote.getCurrentWindow() })
    }

    function showEntryCtxMenu() {
        const menu = new Menu();
        menu.append(new MenuItem({
            label: isWin() ? "🌟  Star" : "⭐️  Star",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({
            label: "💔  Unstar",
            enabled: false,
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "✅️  Mark as read",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({
            label: "📌  Mark as unread",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🔗  Copy Link",
            click: function(){
                alert(`you clicked on`);
            }
        }));

        menu.append(new MenuItem({type: "separator",}));
        menu.append(new MenuItem({
            label: "✏️  Edit Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));
        menu.append(new MenuItem({
            label: "🗑  Unsubscribe Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));

        menu.popup({ window: remote.getCurrentWindow() })
    }
    function viewEntryDetail(entry) {
        currentEntry = entry

        apiReq('/api/entry/get/content', {
            entry_id: currentEntry.id,
            feed_id: currentEntry.feed.id,
            is_podcast: currentEntry.feed.is_podcast
        }).then( rsp => {
            thirdContent = rsp.content
            // TODO podcast
        }).catch(err => {
            // TODO
        })
    }
</script>

<style>
    .list-wrapper {
        flex-grow: 1;
    }
    .list-ul {
        margin: 8px 0 8px 0;
    }
    .list-li {
        padding: 0;
    }
    .list-li:not(.active):hover{
        background-color:#ddd;
        cursor: pointer;
    }
</style>

<Toolbar bind:viewMode bind:viewScope on:refresh-list-view={handleRefreshListView} />

{#if isFeedEntriesView}
    <FeedNav />
{/if}

<div class="list-wrapper">
    <ul class="collection list-ul">
    {#if viewMode === 'feed'}
        {#each itemList as feed (feed.id)}
            <li class="collection-item list-li" on:contextmenu={showFeedCtxMenu}>
                <FeedItem feedInfo={feed} />
            </li>
        {/each}

    {:else if viewMode === 'entry'}
        {#each itemList as entry (entry.id)}
            <li class="collection-item list-li { currentEntry ? (entry.id === currentEntry.id ? 'active' : '') : ''}" 
                on:contextmenu={showEntryCtxMenu} on:click={() => viewEntryDetail(entry)}>
                <EntryItem entryInfo={entry} />
            </li>
        {/each}
    {/if}
    </ul>
</div>

<Pager bind:currentPage bind:numPages on:refresh-list-view={handleRefreshListView} />
