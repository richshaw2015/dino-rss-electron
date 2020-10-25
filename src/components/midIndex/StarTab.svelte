<script>
    export let listRsp = {}
    export let currentEntry
    export let contentApiRsp= {}

    import FeedItem from './FeedItem.svelte'
    import Notice from '../global/Notice.svelte'
    import FeedNav from './FeedNav.svelte'
    import Pager from './Pager.svelte'
    import Toolbar from './Toolbar.svelte'
    import EntryItem from "./EntryItem.svelte"
    import { isWin, getPageSize } from '../utils/helper.js'
    import { shortToast, toast, warnToast } from '../utils/toast.js'
    import { apiReq } from '../utils/req.js'
    import { viewMode } from '../store/store.js'
    import { saveViewMode } from '../utils/storage.js'

    // TODO
    let activeFeed

    const { remote } = require('electron')
    const { Menu, MenuItem } = remote
    const Mousetrap = require('mousetrap')

    import { onMount } from 'svelte'

    onMount(() => {
        // first list request
        updateList(1)

        // shortcut        
        // Mousetrap.bind('n', function() {
        //     // TODO entry view only
        //     if ($viewMode === 'entry' && listRsp.data && listRsp.data.length > 0) {
        //         if (!currentEntry) {
        //             currentEntry = listRsp.data[0]
        //         } else {
        //             // TODO ??
        //         }
        //     }
        //     return false
        // });
    })

    function updateList(page, destMode) {
        if (!destMode) {
            destMode = $viewMode
        }
        if (destMode === 'feed') {
            apiReq('/api/my/stared/feeds', {page: page, page_size: getPageSize()}).then( rsp => {
                listRsp = rsp

                if (rsp.code === 0) {
                    viewMode.set(destMode)

                    saveViewMode(destMode)
                } else if (rsp.code === 100) {
                    listRsp.msg = "No starred Feeds"
                }
            }).catch(err => {
                listRsp.code = -1
                listRsp.msg = err + ' Feeds'

                warnToast(listRsp.msg)
            })
        } else if (destMode === 'entry') {
            apiReq('/api/my/stared/entries', {page: page, page_size: getPageSize()}).then( rsp => {
                listRsp = rsp

                if (rsp.code === 0) {
                    viewMode.set(destMode)

                    saveViewMode(destMode)
                } else if (rsp.code === 100) {
                    listRsp.msg = "No starred Entries"
                }
            }).catch(err => {
                listRsp.code = -1
                listRsp.msg = err + ' Entries'

                warnToast(listRsp.msg)
            })
        }
    }

    function handleToolbarRefresh(event) {
        if (activeFeed) {
            updateFeedEntries(activeFeed, event.detail.page)
        } else {
            updateList(event.detail.page, event.detail.mode)
        }
    }
    // TODO shortcut n N b C r D

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
    function getEntryContent(entry) {
        currentEntry = entry
        contentApiRsp= {}

        apiReq('/api/entry/get/content', {
            entry_id: currentEntry.id,
            feed_id: currentEntry.feed.id,
            is_podcast: currentEntry.feed.is_podcast
        }).then( rsp => {
            contentApiRsp = rsp

            if (rsp.episode && Object.keys(rsp.episode).length > 0) {
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

            warnToast(contentApiRsp.msg)
        })
    }

    function updateFeedEntries(feed, page=1) {
        apiReq('/api/feed/entries', {
            feed_id: feed.id,
            page: page,
            page_size: getPageSize() - 1
        }).then( rsp => {
            if (rsp.code === 0) {
                activeFeed = feed

                listRsp = rsp
            } else if (rsp.code === 100) {
                toast("No Entries data")
            }
        }).catch(err => {
            warnToast(err + ' Entries')
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

<Toolbar showModeBtn={!activeFeed} on:refresh-list-view={handleToolbarRefresh} />

{#if activeFeed}
    <FeedNav {activeFeed} />

    <div class="list-wrapper">
        <ul class="collection list-ul">
            {#each listRsp.data as entry (entry.id)}
            <li class="collection-item list-li { currentEntry ? (entry.id === currentEntry.id ? 'active' : '') : ''}" 
                on:contextmenu={showEntryCtxMenu} on:click={() => getEntryContent(entry)}>
                <EntryItem entryInfo={entry} />
            </li>
            {/each}
        </ul>
    </div>

    <Pager currentPage={listRsp.page} numPages={listRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
{:else}
    {#if listRsp.code === undefined}
        <!-- loading -->
        <Notice />
    {:else if listRsp.code === -1 && !listRsp.data}
        <!-- no current list data -->
        <Notice level="warn" msg={listRsp.msg} />
    {:else if listRsp.code === 0 || listRsp.code === -1 }
        <div class="list-wrapper">
            <ul class="collection list-ul">
            {#if $viewMode === 'feed'}
                {#each listRsp.data as feed (feed.id)}
                    <li class="collection-item list-li" on:contextmenu={showFeedCtxMenu} on:click={() => updateFeedEntries(feed)}>
                        <FeedItem feedInfo={feed} />
                    </li>
                {/each}

            {:else if $viewMode === 'entry'}
                {#each listRsp.data as entry (entry.id)}
                    <li class="collection-item list-li { currentEntry ? (entry.id === currentEntry.id ? 'active' : '') : ''}" 
                        on:contextmenu={showEntryCtxMenu} on:click={() => getEntryContent(entry)}>
                        <EntryItem entryInfo={entry} />
                    </li>
                {/each}
            {/if}
            </ul>
        </div>

        <Pager currentPage={listRsp.page} numPages={listRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {:else if listRsp.code === 100}
        <Notice level="info" msg={listRsp.msg} />
    {/if}
{/if}
