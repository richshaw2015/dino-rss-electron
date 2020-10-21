<script>
    import FeedItem from '../index/FeedItem.svelte'
    import Notice from './Notice.svelte'
    import FeedNav from '../index/FeedNav.svelte'
    import Pager from '../pager/Pager.svelte'
    import Toolbar from '../index/Toolbar.svelte'
    import EntryItem from "../index/EntryItem.svelte"
    import { isWin, getPageSize } from '../utils/helper.js'
    import { toast, warnToast } from '../utils/toast.js'
    import { apiReq } from '../utils/req.js'
    import { activeTab } from '../store/store.js'
    import { saveViewMode } from '../utils/storage.js'

    export let viewMode
    export let viewScope

    export let listApiRsp = {}
    export let currentEntry
    export let contentApiRsp= {}

    // TODO
    let isFeedEntriesView = false

    const { remote } = require('electron');
    const { Menu, MenuItem } = remote;

    import { onMount } from 'svelte';

    onMount(() => {
        const unsubscribe = activeTab.subscribe(switchTab => {
            if (switchTab !== 'apps') {
                refreshListView(1)
            }
        })

        return () => unsubscribe()
    })

    function refreshListView(page, destMode) {
        if (!destMode) {
            destMode = viewMode
        }
        if (destMode === 'feed') {
            const apiPath = ($activeTab === 'rss') ? '/api/my/feeds' : '/api/my/stared/feeds'

            apiReq(apiPath, {page: page, page_size: getPageSize(), scope: viewScope}).then( rsp => {
                listApiRsp.code = rsp.code || 0
                listApiRsp.data = rsp.data

                if (rsp.code === 0) {
                    viewMode = destMode

                    listApiRsp.page = rsp.page
                    listApiRsp.num_pages = rsp.num_pages

                    saveViewMode(destMode)
                } else if (rsp.code === 100) {
                    if ($activeTab === "rss") {
                        if (viewScope === "unread") {
                            listApiRsp.msg = "No unread Feeds"
                        } else if (viewScope === "all") {
                            listApiRsp.msg = "No updated Feeds"
                        }
                    } else if ($activeTab === "star"){
                        listApiRsp.msg = "No starred Feeds"
                    }
                }
            }).catch(err => {
                listApiRsp.code = -1
                listApiRsp.msg = err + ' Feeds'
            })
        } else if (destMode === 'entry') {
            const apiPath = ($activeTab === 'rss') ? '/api/my/entries' : '/api/my/stared/entries'

            apiReq(apiPath, {page: page, page_size: getPageSize(), scope: viewScope}).then( rsp => {
                listApiRsp.code = rsp.code || 0
                listApiRsp.data = rsp.data

                if (rsp.code === 0) {
                    viewMode = destMode

                    listApiRsp.page = rsp.page
                    listApiRsp.num_pages = rsp.num_pages

                    saveViewMode(viewMode)
                } else if (rsp.code === 100) {
                    if ($activeTab === "rss") {
                        if (viewScope === "unread") {
                            listApiRsp.msg = "No unread Entries"
                        } else if (viewScope === "all") {
                            listApiRsp.msg = "No updated Entries"
                        }
                    } else if ($activeTab === "star"){
                        listApiRsp.msg = "No starred Entries"
                    }
                }
            }).catch(err => {
                listApiRsp.code = -1
                listApiRsp.msg = err + ' Entries'
            })
        }
    }
    function handleRefreshListView(event) {
        refreshListView(event.detail.page, event.detail.mode)
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
        contentApiRsp= {}

        apiReq('/api/entry/get/content', {
            entry_id: currentEntry.id,
            feed_id: currentEntry.feed.id,
            is_podcast: currentEntry.feed.is_podcast
        }).then( rsp => {
            contentApiRsp.code = rsp.code || 0
            contentApiRsp.content = rsp.content

            if (Object.keys(rsp.episode).length > 0) {
                let episodeBase = {
                    "version": 5,
                    "show": {
                        "title": currentEntry.feed.title,
                        "subtitle": currentEntry.feed.description,
                        "poster": currentEntry.feed.image,
                        "link": currentEntry.feed.link,
                    },
                    "title": currentEntry.title,
                    "link": currentEntry.link,
                    "publicationDate": currentEntry.updated
                }
                contentApiRsp.episode = Object.assign(episodeBase, rsp.episode)
            }
        }).catch(err => {
            contentApiRsp.code = -1
            contentApiRsp.msg = err + ' Content'
        })
    }
</script>

<style>
    .list-wrapper {
        flex-grow: 1;
        overflow: hidden;
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

{#if listApiRsp.code === undefined}
    <!-- loading -->
    <Notice />
{:else if listApiRsp.code === -1 }
    <!-- error -->
    <Notice level="warn" msg={listApiRsp.msg} />
{:else if listApiRsp.code === 0}
    <!-- success -->
    <div class="list-wrapper">
        <ul class="collection list-ul">
        {#if viewMode === 'feed'}
            {#each listApiRsp.data as feed (feed.id)}
                <li class="collection-item list-li" on:contextmenu={showFeedCtxMenu}>
                    <FeedItem feedInfo={feed} />
                </li>
            {/each}

        {:else if viewMode === 'entry'}
            {#each listApiRsp.data as entry (entry.id)}
                <li class="collection-item list-li { currentEntry ? (entry.id === currentEntry.id ? 'active' : '') : ''}" 
                    on:contextmenu={showEntryCtxMenu} on:click={() => viewEntryDetail(entry)}>
                    <EntryItem entryInfo={entry} />
                </li>
            {/each}
        {/if}
        </ul>
    </div>

    <Pager currentPage={listApiRsp.page} numPages={listApiRsp.num_pages} 
        on:refresh-list-view={handleRefreshListView} />
{:else if listApiRsp.code === 100}
    <!-- business error -->
    {#if $activeTab === 'rss' && viewScope === 'unread'}
        <Notice level="succ" msg={listApiRsp.msg} />
    {:else}
        <Notice level="info" msg={listApiRsp.msg} />
    {/if}
{/if}

{#if isFeedEntriesView}
    <FeedNav />
{/if}


