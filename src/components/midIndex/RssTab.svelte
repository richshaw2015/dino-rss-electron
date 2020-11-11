<script>
    import RssFeed from './RssFeed.svelte'
    import Notice from '../global/Notice.svelte'
    import FeedNav from './FeedNav.svelte'
    import Pager from './Pager.svelte'
    import Toolbar from './Toolbar.svelte'
    import RssEntry from "./RssEntry.svelte"
    import { getPageSize, isInList, shortToast, toast, warnToast } from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    import { saveRssViewMode } from '../utils/storage.js'
    import { rssViewMode, viewScope, rssActiveEntry, rssActiveFeed, rssEntryListRsp, rssFeedListRsp, rssFeedEntriesView, 
        unreadCountRsp} from '../utils/store.js'

    import { onMount, onDestroy } from 'svelte'
    const Mousetrap = require('mousetrap')

    onMount(() => {
        // first list request
        if(!$rssFeedEntriesView) {
            if ($rssViewMode === "entry") {
                if (!$rssEntryListRsp.page || $rssEntryListRsp.page === 1) {
                    updateRssList(1, $rssViewMode)
                }
            } else if ($rssViewMode === "feed") {
                if (!$rssFeedListRsp.page || $rssFeedListRsp.page === 1) {
                    updateRssList(1, $rssViewMode)
                }
            }
        }
        
        // keyboard shortcut
        Mousetrap.bind('n', function() {
            if ($rssEntryListRsp.code !== 0 || $rssEntryListRsp.data.length === 0) {
                return false
            }
            if ($rssViewMode === 'entry' || ($rssViewMode === 'feed' && $rssFeedEntriesView) ) {
                if (!isInList($rssActiveEntry, $rssEntryListRsp.data)) {
                    rssActiveEntry.set($rssEntryListRsp.data[0])
                } else {
                    const index = $rssActiveEntry._index + 1
                    if (index === $rssEntryListRsp.data.length) {
                        warnToast("Already the last Entry")
                    } else {
                        rssActiveEntry.set($rssEntryListRsp.data[index])
                    }
                }
            } else {
                if (!isInList($rssActiveFeed, $rssEntryListRsp.data)) {
                    handleGotoFeedEntries($rssEntryListRsp.data[0])
                } else {
                    const index = $rssActiveFeed._index + 1
                    if (index === $rssEntryListRsp.data.length) {
                        warnToast("Already the last Feed")
                    } else {
                        handleGotoFeedEntries($rssEntryListRsp.data[index])
                    }
                }
            }
            return false
        });
        Mousetrap.bind('N', function() {
            if ($rssEntryListRsp.data.length === 0 || $rssEntryListRsp.code !== 0) {
                return false
            }
            if ($rssViewMode === 'entry' || ($rssViewMode === 'feed' && $rssFeedEntriesView) ) {
                if (!isInList($rssActiveEntry, $rssEntryListRsp.data)) {
                    activeEntry.set($rssEntryListRsp.data[0])
                } else {
                    const index = $rssActiveEntry._index - 1
                    if (index < 0) {
                        warnToast("Already the first Entry")
                    } else {
                        rssActiveEntry.set($rssEntryListRsp.data[index])
                    }
                }
            } else {
                if (!isInList($rssActiveFeed, $rssEntryListRsp.data)) {
                    handleGotoFeedEntries($rssEntryListRsp.data[0])
                } else {
                    const index = $rssActiveFeed._index - 1
                    if (index < 0 ) {
                        warnToast("Already the first Feed")
                    } else {
                        handleGotoFeedEntries($rssEntryListRsp.data[index])
                    }
                }
            }
            return false
        });

        const syncUnreadInterval = setInterval(syncUnreadCount, 3600*1000)

        return () => clearInterval(syncUnreadInterval)
    })

    unreadCountRsp.subscribe(rsp => {
        if (rsp.count < 0 && rsp.code === 0) {
            console.warn("unreadCountRsp changed negative")
            rsp.code = -1
            syncUnreadCount()
        }
        return rsp
    });

    function handleGotoFeedEntries(feed, page) {
        rssActiveFeed.set(feed)
        gotoFeedEntries(page)
    }

    function syncUnreadCount() {
        apiReq('/api/count/unread', {}).then(rsp => {
            if (rsp.code === 0) {
                unreadCountRsp.set(rsp)
            }
        }).catch(err => {
            toast(err + " unread count")
        })
    }

    function updateRssList(page, mode) {
        if (!mode) mode = $rssViewMode

        if (mode === 'feed') {
            apiReq('/api/my/feeds', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                rssEntryListRsp.set(rsp)

                if (!$rssFeedEntriesView) {
                    rssFeedListRsp.set(rsp)
                }

                if (rsp.code === 0) {
                    rssViewMode.set(mode)
                    saveRssViewMode(mode)
                } else if (rsp.code === 100) {
                    rssEntryListRsp.set({
                        "code": rsp.code,
                        "msg": "No updated Feeds"
                    })
                }  else if (rsp.code === 101) {
                    rssEntryListRsp.set({
                        "code": rsp.code,
                        "msg": "No unread Feeds"
                    })
                }
            }).catch(err => {
                rssEntryListRsp.set({
                    "code": -1,
                    "msg": err + ' Feeds'
                })
                warnToast($rssEntryListRsp.msg)
            })
        } else if (mode === 'entry') {
            apiReq('/api/my/entries', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                rssEntryListRsp.set(rsp)

                if (rsp.code === 0) {
                    rssViewMode.set(mode)
                    saveRssViewMode($rssViewMode)
                } else if (rsp.code === 100) {
                    rssEntryListRsp.set({
                        "code": rsp.code,
                        "msg": "No updated Entries"
                    })
                } else if (rsp.code === 101) {
                    rssEntryListRsp.set({
                        "code": rsp.code,
                        "msg": "No unread Entries"
                    })
                }
            }).catch(err => {
                rssEntryListRsp.set({
                    "code": -1,
                    "msg": err + ' Entries'
                })
                warnToast($rssEntryListRsp.msg)
            })
        }

        // sync unread count
        if (page === 1) {
            syncUnreadCount()
        }
    }

    function gotoFeedEntries(page=1) {
        apiReq('/api/feed/entries', {
            feed_id: $rssActiveFeed.id,
            page: page,
            page_size: getPageSize(true), 
            scope: $viewScope
        }).then( rsp => {
            rssFeedEntriesView.set(true)
            rssEntryListRsp.set(rsp)

            if (rsp.code === 101) {
                rssEntryListRsp.set({
                    "code": rsp.code,
                    "msg": "No unread Entries"
                })
            } else if (rsp.code === 100) {
                rssEntryListRsp.set({ 
                    "code": rsp.code,
                    "msg": "No Entries data"
                })
            }
        }).catch(err => {
            warnToast(err + ' Entries')
        })
    }

    function handleToolbarRefresh(event) {
        if ($rssFeedEntriesView) {
            gotoFeedEntries(event.detail.page)
        } else {
            updateRssList(event.detail.page, event.detail.mode)
        }
    }
    // TODO shortcut C r D
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

<Toolbar showModeBtn={!$rssFeedEntriesView} on:refresh-list-view={handleToolbarRefresh} />

{#if $rssFeedEntriesView}
    <FeedNav />

    {#if $rssEntryListRsp.code === 101}
        <Notice level="succ" msg={$rssEntryListRsp.msg} />
    {:else if $rssEntryListRsp.code === 100}
        <Notice level="info" msg={$rssEntryListRsp.msg} />
    {:else}
        <div class="list-wrapper">
            <ul class="collection list-ul">
                {#each $rssEntryListRsp.data as entry (entry.id)}
                <li class="collection-item list-li { entry.id === $rssActiveEntry.id ? 'active' : ''}" 
                    on:click={() => rssActiveEntry.set(entry)}>
                    <RssEntry entryInfo={entry} />
                </li>
                {/each}
            </ul>
        </div>

        <Pager currentPage={$rssEntryListRsp.page} numPages={$rssEntryListRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {/if}
{:else}
    {#if $rssEntryListRsp.code === undefined}
        <!-- loading -->
        <Notice />
    {:else if $rssEntryListRsp.code === -1}
        <Notice level="warn" msg={$rssEntryListRsp.msg} />
    {:else if $rssEntryListRsp.code === 0}
        <div class="list-wrapper">
            <ul class="collection list-ul">
            {#if $rssViewMode === 'feed'}
                {#each $rssEntryListRsp.data as feed (feed.id)}
                    <li class="collection-item list-li { feed.id === $rssActiveFeed.id ? 'active' : '' }" 
                        on:click={() => handleGotoFeedEntries(feed)}>
                        <RssFeed feedInfo={feed} />
                    </li>
                {/each}

            {:else if $rssViewMode === 'entry'}
                {#each $rssEntryListRsp.data as entry (entry.id)}
                    <li class="collection-item list-li { entry.id === $rssActiveEntry.id ? 'active' : ''}" 
                        on:click={() => rssActiveEntry.set(entry)}>
                        <RssEntry entryInfo={entry} />
                    </li>
                {/each}
            {/if}
            </ul>
        </div>

        <Pager currentPage={$rssEntryListRsp.page} numPages={$rssEntryListRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {:else if $rssEntryListRsp.code === 100}
        <Notice level="info" msg={$rssEntryListRsp.msg} />
    {:else if $rssEntryListRsp.code === 101}
        <Notice level="succ" msg={$rssEntryListRsp.msg} />
    {/if}
{/if}
