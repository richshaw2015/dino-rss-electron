<script>
    import StarFeed from './StarFeed.svelte'
    import StarEntry from "./StarEntry.svelte"
    import Notice from '../global/Notice.svelte'
    import FeedNav from './FeedNav.svelte'
    import Pager from './Pager.svelte'
    import Toolbar from './Toolbar.svelte'

    import { getPageSize, isInList, shortToast, toast, warnToast } from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    import { saveStarViewMode } from '../utils/storage.js'
    import { starViewMode, starActiveEntry, starActiveFeed, starFeedEntriesView, starFeedListRsp, starEntryListRsp } 
        from '../utils/store.js'

    import { onMount } from 'svelte'

    onMount(() => {
        if (!$starFeedEntriesView) {
            if ($starViewMode === "entry") {
                if (!$starEntryListRsp.page || $starEntryListRsp.page === 1) {
                    updateStarList(1, $starViewMode)
                }
            } else if ($starViewMode === "feed") {
                if (!$starEntryListRsp.page || $starEntryListRsp.page === 1) {
                    updateStarList(1, $starViewMode)
                }
            }
        }
        
        // keyboard shortcut
        Mousetrap.bind('n', function() {
            if ($starEntryListRsp.data.length === 0 || $starEntryListRsp.code !== 0) {
                return false
            }
            if ($starViewMode === 'entry' || ($starViewMode === 'feed' && $starFeedEntriesView) ) {
                if (!isInList($starActiveEntry, $starEntryListRsp.data)) {
                    starActiveEntry.set($starEntryListRsp.data[0])
                } else {
                    const index = $starActiveEntry._index + 1
                    if (index === $starEntryListRsp.data.length) {
                        warnToast("Already the last Entry")
                    } else {
                        starActiveEntry.set($starEntryListRsp.data[index])
                    }
                }
            } else {
                if (!isInList($starActiveFeed, $starEntryListRsp.data)) {
                    starActiveFeed.set($starEntryListRsp.data[0])
                } else {
                    const index = $starActiveFeed._index + 1
                    if (index === $starEntryListRsp.data.length) {
                        warnToast("Already the last Feed")
                    } else {
                        starActiveFeed.set($starEntryListRsp.data[index])
                    }
                }
            }
            return false
        });
        Mousetrap.bind('N', function() {
            if ($starEntryListRsp.data.length === 0 || $starEntryListRsp.code !== 0) {
                return false
            }
            if ($starViewMode === 'entry' || ($starViewMode === 'feed' && $starFeedEntriesView) ) {
                if (!isInList($starActiveEntry, $starEntryListRsp.data)) {
                    starActiveEntry.set($starEntryListRsp.data[0])
                } else {
                    const index = $starActiveEntry._index - 1
                    if (index < 0) {
                        warnToast("Already the first Entry")
                    } else {
                        starActiveEntry.set($starEntryListRsp.data[index])
                    }
                }
            } else {
                if (!isInList($starActiveFeed, $starEntryListRsp.data)) {
                    starActiveFeed.set($starEntryListRsp.data[0])
                } else {
                    const index = $starActiveFeed._index - 1
                    if (index < 0 ) {
                        warnToast("Already the first Feed")
                    } else {
                        starActiveFeed.set($starEntryListRsp.data[index])
                    }
                }
            }
            return false
        });
    })

    function updateStarList(page, mode) {
        if (!mode) mode = $starViewMode

        if (mode === 'feed') {
            apiReq('/api/my/starred/feeds', {page: page, page_size: getPageSize()}).then( rsp => {
                starEntryListRsp.set(rsp)

                if (rsp.code === 0) {
                    starViewMode.set(mode)
                    saveStarViewMode(mode)
                } else if (rsp.code === 100) {
                    $starEntryListRsp.msg = "No starred Feeds"
                }
            }).catch(err => {
                const msg =  err + ' starred Feeds'
                starEntryListRsp.set({
                    code: -1,
                    msg:  msg
                })
                warnToast(msg)
            })
        } else if (mode === 'entry') {
            apiReq('/api/my/starred/entries', {page: page, page_size: getPageSize()}).then( rsp => {
                starEntryListRsp.set(rsp)
                
                if (rsp.code === 0) {
                    starViewMode.set(mode)
                    saveStarViewMode($starViewMode)
                } else if (rsp.code === 100) {
                    $starEntryListRsp.msg ="No starred Entries"
                }
            }).catch(err => {
                const msg =  err + ' starred Entries'
                starEntryListRsp.set({
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
        }).then( rsp => {
            starFeedEntriesView.set(true)
            feedListRspBak.set($starEntryListRsp)
            $starEntryListRsp = rsp

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

    {#if $starEntryListRsp.code === 100}
        <Notice level="info" msg={$starEntryListRsp.msg} />
    {:else}
        <div class="list-wrapper">
            <ul class="collection list-ul">
                {#each $starEntryListRsp.data as entry (entry.id)}
                <li class="collection-item list-li { entry.id === $starActiveEntry.id ? 'active' : ''}" 
                    on:click={() => starActiveEntry.set(entry)}>
                    <StarEntry entryInfo={entry} />
                </li>
                {/each}
            </ul>
        </div>

        <Pager currentPage={$starEntryListRsp.page} numPages={$starEntryListRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {/if}
{:else}
    {#if $starEntryListRsp.code === undefined}
        <!-- loading -->
        <Notice />
    {:else if $starEntryListRsp.code === -1 && !$starEntryListRsp.data}
        <!-- no current list data -->
        <Notice level="warn" msg={$starEntryListRsp.msg} />
    {:else if $starEntryListRsp.code === 0 || $starEntryListRsp.code === -1 }
        <div class="list-wrapper">
            <ul class="collection list-ul">
            {#if $starViewMode === 'feed'}
                {#each $starEntryListRsp.data as feed (feed.id)}
                    <li class="collection-item list-li { feed.id === $starActiveFeed.id ? 'active' : '' }" 
                        on:click={() => starActiveFeed.set(feed)}>
                        <StarFeed feedInfo={feed} />
                    </li>
                {/each}

            {:else if $starViewMode === 'entry'}
                {#each $starEntryListRsp.data as entry (entry.id)}
                    <li class="collection-item list-li { entry.id === $starActiveEntry.id ? 'active' : ''}" 
                        on:click={() => starActiveEntry.set(entry)}>
                        <StarEntry entryInfo={entry} />
                    </li>
                {/each}
            {/if}
            </ul>
        </div>

        <Pager currentPage={$starEntryListRsp.page} numPages={$starEntryListRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {:else if $starEntryListRsp.code === 100}
        <Notice level="info" msg={$starEntryListRsp.msg} />
    {/if}
{/if}
