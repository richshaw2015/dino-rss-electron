<script>
    import FeedItem from './FeedItem.svelte'
    import Notice from '../global/Notice.svelte'
    import FeedNav from './FeedNav.svelte'
    import Pager from './Pager.svelte'
    import Toolbar from './Toolbar.svelte'
    import EntryItem from "./EntryItem.svelte"
    import { getPageSize, isInList } from '../utils/helper.js'
    import { shortToast, toast, warnToast } from '../utils/toast.js'
    import { apiReq } from '../utils/req.js'
    import { saveViewMode } from '../utils/storage.js'
    import { viewMode, viewScope, rssActiveEntry, rssActiveFeed, rssListRsp, rssFeedListRsp, rssEntryContentRsp, 
        rssFeedEntriesView } from '../store/store.js'

    import { onMount, onDestroy } from 'svelte'
    const Mousetrap = require('mousetrap')

    onMount(() => {
        // first list request
        if(!$rssFeedEntriesView) {
            updateRssList(1, $viewMode)
        }
        
        // keyboard shortcut
        Mousetrap.bind('n', function() {
            if ($rssListRsp.code !== 0 || $rssListRsp.data.length === 0) {
                return false
            }
            if ($viewMode === 'entry' || ($viewMode === 'feed' && $rssFeedEntriesView) ) {
                if (!isInList($rssActiveEntry, $rssListRsp.data)) {
                    rssActiveEntry.set($rssListRsp.data[0])
                } else {
                    const index = $rssActiveEntry._index + 1
                    if (index === $rssListRsp.data.length) {
                        warnToast("Already the last Entry")
                    } else {
                        rssActiveEntry.set($rssListRsp.data[index])
                    }
                }
            } else {
                if (!isInList($rssActiveFeed, $rssListRsp.data)) {
                    handleGotoFeedEntries($rssListRsp.data[0])
                } else {
                    const index = $rssActiveFeed._index + 1
                    if (index === $rssListRsp.data.length) {
                        warnToast("Already the last Feed")
                    } else {
                        handleGotoFeedEntries($rssListRsp.data[index])
                    }
                }
            }
            return false
        });
        Mousetrap.bind('N', function() {
            if ($rssListRsp.data.length === 0 || $rssListRsp.code !== 0) {
                return false
            }
            if ($viewMode === 'entry' || ($viewMode === 'feed' && $rssFeedEntriesView) ) {
                if (!isInList($rssActiveEntry, $rssListRsp.data)) {
                    activeEntry.set($rssListRsp.data[0])
                } else {
                    const index = $rssActiveEntry._index - 1
                    if (index < 0) {
                        warnToast("Already the first Entry")
                    } else {
                        rssActiveEntry.set($rssListRsp.data[index])
                    }
                }
            } else {
                if (!isInList($rssActiveFeed, $rssListRsp.data)) {
                    handleGotoFeedEntries($rssListRsp.data[0])
                } else {
                    const index = $rssActiveFeed._index - 1
                    if (index < 0 ) {
                        warnToast("Already the first Feed")
                    } else {
                        handleGotoFeedEntries($rssListRsp.data[index])
                    }
                }
            }
            return false
        });
    })
    onDestroy(() => {
        console.log("onDestroy RssTab")
    })

    function handleGotoFeedEntries(feed, page) {
        rssActiveFeed.set(feed)
        gotoFeedEntries(page)
    }

    function updateRssList(page, mode) {
        if (!mode) mode = $viewMode

        if (mode === 'feed') {
            apiReq('/api/my/feeds', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                rssListRsp.set(rsp)

                if (!$rssFeedEntriesView) {
                    rssFeedListRsp.set(rsp)
                }

                if (rsp.code === 0) {
                    viewMode.set(mode)
                    saveViewMode(mode)
                } else if (rsp.code === 100) {
                    rssListRsp.set({
                        "code": rsp.code,
                        "msg": "No updated Feeds"
                    })
                }  else if (rsp.code === 101) {
                    rssListRsp.set({
                        "code": rsp.code,
                        "msg": "No unread Feeds"
                    })
                }
            }).catch(err => {
                rssListRsp.set({
                    "code": -1,
                    "msg": err + ' Feeds'
                })
                warnToast($rssListRsp.msg)
            })
        } else if (mode === 'entry') {
            apiReq('/api/my/entries', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                rssListRsp.set(rsp)

                if (rsp.code === 0) {
                    viewMode.set(mode)
                    saveViewMode($viewMode)
                } else if (rsp.code === 100) {
                    rssListRsp.set({
                        "code": rsp.code,
                        "msg": "No updated Entries"
                    })
                } else if (rsp.code === 101) {
                    rssListRsp.set({
                        "code": rsp.code,
                        "msg": "No unread Entries"
                    })
                }
            }).catch(err => {
                rssListRsp.set({
                    "code": -1,
                    "msg": err + ' Entries'
                })
                warnToast($rssListRsp.msg)
            })
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
            rssListRsp.set(rsp)

            if (rsp.code === 101) {
                rssListRsp.set({
                    "code": rsp.code,
                    "msg": "No unread Entries"
                })
            } else if (rsp.code === 100) {
                rssListRsp.set({ 
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

    {#if $rssListRsp.code === 101}
        <Notice level="succ" msg={$rssListRsp.msg} />
    {:else if $rssListRsp.code === 100}
        <Notice level="info" msg={$rssListRsp.msg} />
    {:else}
        <div class="list-wrapper">
            <ul class="collection list-ul">
                {#each $rssListRsp.data as entry (entry.id)}
                <li class="collection-item list-li { entry.id === $rssActiveEntry.id ? 'active' : ''}" 
                    on:click={() => rssActiveEntry.set(entry)}>
                    <EntryItem entryInfo={entry} />
                </li>
                {/each}
            </ul>
        </div>

        <Pager currentPage={$rssListRsp.page} numPages={$rssListRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {/if}
{:else}
    {#if $rssListRsp.code === undefined}
        <!-- loading -->
        <Notice />
    {:else if $rssListRsp.code === -1}
        <Notice level="warn" msg={$rssListRsp.msg} />
    {:else if $rssListRsp.code === 0}
        <div class="list-wrapper">
            <ul class="collection list-ul">
            {#if $viewMode === 'feed'}
                {#each $rssListRsp.data as feed (feed.id)}
                    <li class="collection-item list-li { feed.id === $rssActiveFeed.id ? 'active' : '' }" 
                        on:click={() => handleGotoFeedEntries(feed)}>
                        <FeedItem feedInfo={feed} />
                    </li>
                {/each}

            {:else if $viewMode === 'entry'}
                {#each $rssListRsp.data as entry (entry.id)}
                    <li class="collection-item list-li { entry.id === $rssActiveEntry.id ? 'active' : ''}" 
                        on:click={() => rssActiveEntry.set(entry)}>
                        <EntryItem entryInfo={entry}  />
                    </li>
                {/each}
            {/if}
            </ul>
        </div>

        <Pager currentPage={$rssListRsp.page} numPages={$rssListRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {:else if $rssListRsp.code === 100}
        <Notice level="info" msg={$rssListRsp.msg} />
    {:else if $rssListRsp.code === 101}
        <Notice level="succ" msg={$rssListRsp.msg} />
    {/if}
{/if}
