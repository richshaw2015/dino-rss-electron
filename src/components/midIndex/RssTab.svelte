<script>
    export let listRsp = {}

    import FeedItem from './FeedItem.svelte'
    import Notice from '../global/Notice.svelte'
    import FeedNav from './FeedNav.svelte'
    import Pager from './Pager.svelte'
    import Toolbar from './Toolbar.svelte'
    import EntryItem from "./EntryItem.svelte"
    import { isWin, getPageSize } from '../utils/helper.js'
    import { shortToast, toast, warnToast } from '../utils/toast.js'
    import { apiReq } from '../utils/req.js'
    import { saveViewMode } from '../utils/storage.js'
    import { viewMode, viewScope, activeEntry, entryContentRsp, listRspBak } from '../store/store.js'

    let activeFeed

    const { remote } = require('electron')
    const { Menu, MenuItem } = remote
    const Mousetrap = require('mousetrap')

    import { onMount } from 'svelte'

    onMount(() => {
        // first list request
        updateList(1)
    })

    function updateList(page, destMode=null) {
        if (!destMode) {
            destMode = $viewMode
        }
        if (destMode === 'feed') {
            apiReq('/api/my/feeds', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                listRsp.code = rsp.code || 0
                listRsp.data = rsp.data

                if (rsp.code === 0) {
                    viewMode.set(destMode)

                    listRsp.page = rsp.page
                    listRsp.num_pages = rsp.num_pages

                    saveViewMode(destMode)
                } else if (rsp.code === 100) {
                    listRsp.msg = "No updated Feeds"
                }  else if (rsp.code === 101) {
                    listRsp.msg = "No unread Feeds"
                }
            }).catch(err => {
                listRsp.code = -1
                listRsp.msg = err + ' Feeds'

                warnToast(listRsp.msg)
            })
        } else if (destMode === 'entry') {
            apiReq('/api/my/entries', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                listRsp.code = rsp.code || 0
                listRsp.data = rsp.data

                if (rsp.code === 0) {
                    viewMode.set(destMode)

                    listRsp.page = rsp.page
                    listRsp.num_pages = rsp.num_pages

                    saveViewMode($viewMode)
                } else if (rsp.code === 100) {
                    listRsp.msg ="No updated Entries"
                }  else if (rsp.code === 101) {
                    listRsp.msg = "No unread Entries"
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
            updateFeedEntries(activeFeed, event.detail.page, false)
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
        activeEntry.set(entry)
        entryContentRsp.set({})

        apiReq('/api/entry/get/content', {
            entry_id: $activeEntry.id,
            feed_id: $activeEntry.feed.id,
            is_podcast: $activeEntry.feed.is_podcast
        }).then( rsp => {
            if (rsp.episode && Object.keys(rsp.episode).length > 0) {
                let episodeBase = {
                    "version": 5,
                    "show": {
                        "title": $activeEntry.feed.title,
                        "subtitle": $activeEntry.feed.description,
                        "poster": $activeEntry.feed.image,
                        "link": $activeEntry.feed.link,
                    },
                    "title": $activeEntry.title,
                    "link": $activeEntry.link,
                    "publicationDate": $activeEntry.updated
                }
                entryContentRsp.set({
                    code: rsp.code || 0,
                    content: rsp.content,
                    episode: Object.assign(episodeBase, rsp.episode)
                })
            } else {
                entryContentRsp.set({
                    code: rsp.code || 0,
                    content: rsp.content
                })
            }
        }).catch(err => {
            const msg =  err + ' Content'
            entryContentRsp.set({
                    code: -1,
                    msg: msg
            })

            warnToast(msg)
        })
    }

    function updateFeedEntries(feed, page=1, saveCtx=false) {
        apiReq('/api/feed/entries', {
            feed_id: feed.id,
            page: page,
            page_size: getPageSize() - 1, 
            scope: $viewScope
        }).then( rsp => {
            if (rsp.code === 0 || rsp.code === 101) {
                activeFeed = feed
                if (saveCtx) {
                    console.log(listRsp)
                    listRspBak.set(listRsp)
                }
                listRsp = rsp

                if (rsp.code === 101) {
                    listRsp.msg = "No unread Entries"
                }
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
    <FeedNav bind:activeFeed bind:listRsp />

    {#if listRsp.code === 101}
        <Notice level="succ" msg={listRsp.msg} />
    {:else}
        <div class="list-wrapper">
            <ul class="collection list-ul">
                {#each listRsp.data as entry (entry.id)}
                <li class="collection-item list-li { entry.id === $activeEntry.id ? 'active' : ''}" 
                    on:contextmenu={showEntryCtxMenu} on:click={() => getEntryContent(entry)}>
                    <EntryItem entryInfo={entry} />
                </li>
                {/each}
            </ul>
        </div>

        <Pager currentPage={listRsp.page} numPages={listRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {/if}
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
                    <li class="collection-item list-li" on:contextmenu={showFeedCtxMenu} on:click={() => updateFeedEntries(feed, 1, true)}>
                        <FeedItem feedInfo={feed} />
                    </li>
                {/each}

            {:else if $viewMode === 'entry'}
                {#each listRsp.data as entry (entry.id)}
                    <li class="collection-item list-li { entry.id === $activeEntry.id ? 'active' : ''}" 
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
    {:else if listRsp.code === 101}
        <Notice level="succ" msg={listRsp.msg} />
    {/if}
{/if}
