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
    import { viewMode, viewScope, starActiveEntry, starActiveFeed, starFeedEntriesView, starFeedListRsp, starListRsp } 
        from '../store/store.js'

    import { onMount } from 'svelte'

    onMount(() => {
        if (!$starFeedEntriesView) {
            updateStarList(1)
        }
        
        // keyboard shortcut
        Mousetrap.bind('n', function() {
            if ($starListRsp.data.length === 0 || $starListRsp.code !== 0) {
                return false
            }
            if ($viewMode === 'entry' || ($viewMode === 'feed' && $starFeedEntriesView) ) {
                if (!isInList($starActiveEntry, $starListRsp.data)) {
                    shortToast("Next Entry")
                    starActiveEntry.set($starListRsp.data[0])
                } else {
                    const index = $starActiveEntry._index + 1
                    if (index === $starListRsp.data.length) {
                        warnToast("Already the last Entry")
                    } else {
                        shortToast("Next Entry")
                        starActiveEntry.set($starListRsp.data[index])
                    }
                }
            } else {
                if (!isInList($starActiveFeed, $starListRsp.data)) {
                    shortToast("Next Feed")
                    starActiveFeed.set($starListRsp.data[0])
                } else {
                    const index = $starActiveFeed._index + 1
                    if (index === $starListRsp.data.length) {
                        warnToast("Already the last Feed")
                    } else {
                        shortToast("Next Feed")
                        starActiveFeed.set($starListRsp.data[index])
                    }
                }
            }
            return false
        });
        Mousetrap.bind('N', function() {
            if ($starListRsp.data.length === 0 || $starListRsp.code !== 0) {
                return false
            }
            if ($viewMode === 'entry' || ($viewMode === 'feed' && $starFeedEntriesView) ) {
                if (!isInList($starActiveEntry, $starListRsp.data)) {
                    shortToast("Previous Entry")
                    starActiveEntry.set($starListRsp.data[0])
                } else {
                    const index = $starActiveEntry._index - 1
                    if (index < 0) {
                        warnToast("Already the first Entry")
                    } else {
                        shortToast("Previous Entry")
                        starActiveEntry.set($starListRsp.data[index])
                    }
                }
            } else {
                if (!isInList($starActiveFeed, $starListRsp.data)) {
                    shortToast("Previous Feed")
                    starActiveFeed.set($starListRsp.data[0])
                } else {
                    const index = $starActiveFeed._index - 1
                    if (index < 0 ) {
                        warnToast("Already the first Feed")
                    } else {
                        shortToast("Previous Feed")
                        starActiveFeed.set($starListRsp.data[index])
                    }
                }
            }
            return false
        });
    })

    function updateStarList(page, mode) {
        if (!mode) mode = $viewMode

        if (mode === 'feed') {
            apiReq('/api/my/starred/feeds', {page: page, page_size: getPageSize()}).then( rsp => {
                starListRsp.set(rsp)

                if (rsp.code === 0) {
                    viewMode.set(mode)
                    saveViewMode(mode)
                } else if (rsp.code === 100) {
                    $starListRsp.msg = "No starred Feeds"
                }
            }).catch(err => {
                const msg =  err + ' starred Feeds'
                starListRsp.set({
                    code: -1,
                    msg:  msg
                })
                warnToast(msg)
            })
        } else if (mode === 'entry') {
            apiReq('/api/my/starred/entries', {page: page, page_size: getPageSize()}).then( rsp => {
                starListRsp.set(rsp)
                
                if (rsp.code === 0) {
                    viewMode.set(mode)
                    saveViewMode($viewMode)
                } else if (rsp.code === 100) {
                    $starListRsp.msg ="No starred Entries"
                }
            }).catch(err => {
                const msg =  err + ' starred Entries'
                starListRsp.set({
                    code: -1,
                    msg:  msg
                })
                warnToast(msg)
            })
        }
    }

    function handleToolbarRefresh(event) {
        if ($starFeedEntriesView) {
            gotoStarredFeedEntries($starActiveFeed, event.detail.page)
        } else {
            updateStarList(event.detail.page, event.detail.mode)
        }
    }

    function gotoStarredFeedEntries(feed, page=1) {
        apiReq('/api/starred/feed/entries', {
            feed_id: feed.id,
            page: page,
            page_size: getPageSize(true), 
            scope: $viewScope
        }).then( rsp => {
            starFeedEntriesView.set(true)
            feedListRspBak.set($starListRsp)
            $starListRsp = rsp

            if (rsp.code === 100) {
                toast("No starred Entries")
            }
        }).catch(err => {
            warnToast(err + ' starred Entries')
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

<Toolbar showModeBtn={!$starFeedEntriesView} on:refresh-list-view={handleToolbarRefresh} />

{#if $starFeedEntriesView}
    <FeedNav />

    {#if $starListRsp.code === 100}
        <Notice level="info" msg={$starListRsp.msg} />
    {:else}
        <div class="list-wrapper">
            <ul class="collection list-ul">
                {#each $starListRsp.data as entry (entry.id)}
                <li class="collection-item list-li { entry.id === $starActiveEntry.id ? 'active' : ''}" 
                    on:click={() => starActiveEntry.set(entry)}>
                    <EntryItem entryInfo={entry} />
                </li>
                {/each}
            </ul>
        </div>

        <Pager currentPage={$starListRsp.page} numPages={$starListRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {/if}
{:else}
    {#if $starListRsp.code === undefined}
        <!-- loading -->
        <Notice />
    {:else if $starListRsp.code === -1 && !$starListRsp.data}
        <!-- no current list data -->
        <Notice level="warn" msg={$starListRsp.msg} />
    {:else if $starListRsp.code === 0 || $starListRsp.code === -1 }
        <div class="list-wrapper">
            <ul class="collection list-ul">
            {#if $viewMode === 'feed'}
                {#each $starListRsp.data as feed (feed.id)}
                    <li class="collection-item list-li { feed.id === $starActiveFeed.id ? 'active' : '' }" 
                        on:click={() => starActiveFeed.set(feed)}>
                        <FeedItem feedInfo={feed} />
                    </li>
                {/each}

            {:else if $viewMode === 'entry'}
                {#each $starListRsp.data as entry (entry.id)}
                    <li class="collection-item list-li { entry.id === $starActiveEntry.id ? 'active' : ''}" 
                        on:click={() => starActiveEntry.set(entry)}>
                        <EntryItem entryInfo={entry}  />
                    </li>
                {/each}
            {/if}
            </ul>
        </div>

        <Pager currentPage={$starListRsp.page} numPages={$starListRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {:else if $starListRsp.code === 100}
        <Notice level="info" msg={$starListRsp.msg} />
    {/if}
{/if}
