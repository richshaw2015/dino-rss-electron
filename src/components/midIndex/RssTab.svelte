<script>
    export let listApiRsp = {}

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
    import { viewMode, viewScope, activeEntry, activeEntryContentRsp } from '../store/store.js'

    // TODO
    let currentFeed

    const { remote } = require('electron')
    const { Menu, MenuItem } = remote
    const Mousetrap = require('mousetrap')

    import { onMount } from 'svelte'

    onMount(() => {
        // first list request
        refreshListView(1)
    })

    function refreshListView(page, destMode) {
        if (!destMode) {
            destMode = $viewMode
        }
        if (destMode === 'feed') {
            apiReq('/api/my/feeds', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                listApiRsp.code = rsp.code || 0
                listApiRsp.data = rsp.data

                if (rsp.code === 0) {
                    viewMode.set(destMode)

                    listApiRsp.page = rsp.page
                    listApiRsp.num_pages = rsp.num_pages

                    saveViewMode(destMode)
                } else if (rsp.code === 100) {
                    listApiRsp.msg = "No updated Feeds"
                }  else if (rsp.code === 101) {
                    listApiRsp.msg = "No unread Feeds"
                }
            }).catch(err => {
                listApiRsp.code = -1
                listApiRsp.msg = err + ' Feeds'

                warnToast(listApiRsp.msg)
            })
        } else if (destMode === 'entry') {
            apiReq('/api/my/entries', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                listApiRsp.code = rsp.code || 0
                listApiRsp.data = rsp.data

                if (rsp.code === 0) {
                    viewMode.set(destMode)

                    listApiRsp.page = rsp.page
                    listApiRsp.num_pages = rsp.num_pages

                    saveViewMode($viewMode)
                } else if (rsp.code === 100) {
                    listApiRsp.msg ="No updated Entries"
                }  else if (rsp.code === 101) {
                    listApiRsp.msg = "No unread Entries"
                }
            }).catch(err => {
                listApiRsp.code = -1
                listApiRsp.msg = err + ' Entries'

                warnToast(listApiRsp.msg)
            })
        }
    }

    function handleRefreshListReq(event) {
        if (currentFeed) {
            viewFeedEntries(currentFeed, event.detail.page)
        } else {
            refreshListView(event.detail.page, event.detail.mode)
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
    function viewEntryDetail(entry) {
        activeEntry.set(entry)
        activeEntryContentRsp.set({})

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
                activeEntryContentRsp.set({
                    code: rsp.code || 0,
                    content: rsp.content,
                    episode: Object.assign(episodeBase, rsp.episode)
                })
            } else {
                activeEntryContentRsp.set({
                    code: rsp.code || 0,
                    content: rsp.content
                })
            }
        }).catch(err => {
            const msg =  err + ' Content'
            activeEntryContentRsp.set({
                    code: -1,
                    msg: msg
            })

            warnToast(msg)
        })
    }

    function viewFeedEntries(feed, page=1) {
        apiReq('/api/feed/entries', {
            feed_id: feed.id,
            page: page,
            page_size: getPageSize() - 1, 
            scope: $viewScope
        }).then( rsp => {
            if (rsp.code === 0) {
                currentFeed = feed
                listApiRsp = rsp
            } else if (rsp.code === 100) {
                toast("No Entries data")
            }  else if (rsp.code === 101) {
                currentFeed = feed
                listApiRsp = rsp
                listApiRsp.msg = "No unread Entries"
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

<Toolbar showModeBtn={!currentFeed} on:refresh-list-view={handleRefreshListReq} />

{#if currentFeed}
    <FeedNav {currentFeed} />

    {#if listApiRsp.code === 101}
        <Notice level="succ" msg={listApiRsp.msg} />
    {:else}
        <div class="list-wrapper">
            <ul class="collection list-ul">
                {#each listApiRsp.data as entry (entry.id)}
                <li class="collection-item list-li { entry.id === $activeEntry.id ? 'active' : ''}" 
                    on:contextmenu={showEntryCtxMenu} on:click={() => viewEntryDetail(entry)}>
                    <EntryItem entryInfo={entry} />
                </li>
                {/each}
            </ul>
        </div>

        <Pager currentPage={listApiRsp.page} numPages={listApiRsp.num_pages} 
            on:refresh-list-view={handleRefreshListReq} />
    {/if}
{:else}
    {#if listApiRsp.code === undefined}
        <!-- loading -->
        <Notice />
    {:else if listApiRsp.code === -1 && !listApiRsp.data}
        <!-- no current list data -->
        <Notice level="warn" msg={listApiRsp.msg} />
    {:else if listApiRsp.code === 0 || listApiRsp.code === -1 }
        <div class="list-wrapper">
            <ul class="collection list-ul">
            {#if $viewMode === 'feed'}
                {#each listApiRsp.data as feed (feed.id)}
                    <li class="collection-item list-li" on:contextmenu={showFeedCtxMenu} on:click={() => viewFeedEntries(feed)}>
                        <FeedItem feedInfo={feed} />
                    </li>
                {/each}

            {:else if $viewMode === 'entry'}
                {#each listApiRsp.data as entry (entry.id)}
                    <li class="collection-item list-li { entry.id === $activeEntry.id ? 'active' : ''}" 
                        on:contextmenu={showEntryCtxMenu} on:click={() => viewEntryDetail(entry)}>
                        <EntryItem entryInfo={entry} />
                    </li>
                {/each}
            {/if}
            </ul>
        </div>

        <Pager currentPage={listApiRsp.page} numPages={listApiRsp.num_pages} 
            on:refresh-list-view={handleRefreshListReq} />
    {:else if listApiRsp.code === 100}
        <Notice level="info" msg={listApiRsp.msg} />
    {:else if listApiRsp.code === 101}
        <Notice level="succ" msg={listApiRsp.msg} />
    {/if}
{/if}
