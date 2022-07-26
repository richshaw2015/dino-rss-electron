<script>
    import StarFeed from './StarFeed.svelte'
    import StarEntry from "./StarEntry.svelte"
    import Notice from '../global/Notice.svelte'
    import FeedNav from './FeedNav.svelte'
    import Pager from './Pager.svelte'
    import Toolbar from './Toolbar.svelte'

    import { getPageSize, isInList, shortToast, toast, warnToast, i18n } from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    import { saveStarViewMode } from '../utils/storage.js'
    import { starViewMode, starActiveEntry, starActiveFeed, starFeedEntriesView, starFeedListRspBak, starListRsp } 
        from '../utils/store.js'

    import { onMount } from 'svelte'

    onMount(() => {
        if (!$starFeedEntriesView) {
            if (!$starListRsp.page || $starListRsp.page === 1) {
                updateStarList(1, $starViewMode)
            }
        }
        
        // keyboard shortcut
        Mousetrap.bind(['n', 'down'], function() {
            if ($starListRsp.data.length === 0 || $starListRsp.code !== 0) {
                return false
            }
            if ($starViewMode === 'entry' || ($starViewMode === 'feed' && $starFeedEntriesView) ) {
                if (!isInList($starActiveEntry, $starListRsp.data)) {
                    starActiveEntry.set($starListRsp.data[0])
                } else {
                    const index = $starActiveEntry._index + 1
                    if (index === $starListRsp.data.length) {
                        warnToast(i18n('already.last.entry'))
                    } else {
                        starActiveEntry.set($starListRsp.data[index])
                    }
                }
            } else if ($starViewMode === 'feed' && !$starFeedEntriesView) {
                if (!isInList($starActiveFeed, $starListRsp.data)) {
                    handleGotoStarredFeedEntries($starListRsp.data[0])
                } else {
                    const index = $starActiveFeed._index + 1
                    if (index === $starListRsp.data.length) {
                        warnToast(i18n('already.last.feed'))
                    } else {
                        handleGotoStarredFeedEntries($starListRsp.data[index])
                    }
                }
            }
            return false
        });
        Mousetrap.bind(['N', 'up'], function() {
            if ($starListRsp.data.length === 0 || $starListRsp.code !== 0) {
                return false
            }
            if ($starViewMode === 'entry' || ($starViewMode === 'feed' && $starFeedEntriesView) ) {
                if (!isInList($starActiveEntry, $starListRsp.data)) {
                    starActiveEntry.set($starListRsp.data[0])
                } else {
                    const index = $starActiveEntry._index - 1
                    if (index < 0) {
                        warnToast(i18n('already.first.entry'))
                    } else {
                        starActiveEntry.set($starListRsp.data[index])
                    }
                }
            } else if ($starViewMode === 'feed' && !$starFeedEntriesView) {
                if (!isInList($starActiveFeed, $starListRsp.data)) {
                    handleGotoStarredFeedEntries($starListRsp.data[0])
                } else {
                    const index = $starActiveFeed._index - 1
                    if (index < 0 ) {
                        warnToast(i18n('already.first.feed'))
                    } else {
                        handleGotoStarredFeedEntries($starListRsp.data[index])
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
                if (!$starFeedEntriesView) {
                    starListRsp.set(rsp)
                
                    if (!$starFeedEntriesView) {
                        starFeedListRspBak.set(rsp)
                    }

                    if (rsp.code === 0) {
                        if ($starViewMode !== mode) {
                            starViewMode.set(mode)
                            saveStarViewMode(mode)
                        }
                    } else if (rsp.code === 100) {
                        $starListRsp.msg = i18n('no.starred.feed')
                    }
                }
            }).catch(err => {
                starListRsp.set({
                    code: -1,
                    msg:  err
                })
                warnToast($starListRsp.msg)
            })
        } else if (mode === 'entry') {
            apiReq('/api/my/starred/entries', {page: page, page_size: getPageSize()}).then( rsp => {
                starListRsp.set(rsp)
                
                if (rsp.code === 0) {
                    if ($starViewMode !== mode) {
                        starViewMode.set(mode)
                        saveStarViewMode($starViewMode)
                    }
                } else if (rsp.code === 100) {
                    $starListRsp.msg = i18n('no.starred.entry')
                }
            }).catch(err => {
                starListRsp.set({
                    code: -1,
                    msg:  err
                })
                warnToast($starListRsp.msg)
            })
        }
    }

    function handleToolbarRefresh(event) {
        if ($starFeedEntriesView) {
            gotoStarredFeedEntries(event.detail.page)
        } else {
            updateStarList(event.detail.page, event.detail.mode)
        }
    }
    function handleGotoStarredFeedEntries(feed, page=1) {
        if (!$starFeedEntriesView && $starViewMode === "feed") {
            starActiveFeed.set(feed)
            gotoStarredFeedEntries(page)
        }
    }
    function gotoStarredFeedEntries(page=1) {
        apiReq('/api/starred/feed/entries', {
            feed_id: $starActiveFeed.id,
            page: page,
            page_size: getPageSize(true),
        }).then( rsp => {
            if (!$starFeedEntriesView) {
                starFeedEntriesView.set(true)
            }
            starListRsp.set(rsp)

            if (rsp.code === 100) {
                $starListRsp.msg = i18n('no.starred.entry')
            }
        }).catch(err => {
            warnToast(err)
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
    @media (prefers-color-scheme: dark) {
        .list-li:not(.active):hover{
            background-color: #373737;
        }
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
                    <StarEntry entryInfo={entry} />
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
            {#if $starViewMode === 'feed'}
                {#each $starListRsp.data as feed (feed.id)}
                    <li class="collection-item list-li { feed.id === $starActiveFeed.id ? 'active' : '' }" 
                        on:click={() => handleGotoStarredFeedEntries(feed)}>
                        <StarFeed feedInfo={feed} />
                    </li>
                {/each}

            {:else if $starViewMode === 'entry'}
                {#each $starListRsp.data as entry (entry.id)}
                    <li class="collection-item list-li { entry.id === $starActiveEntry.id ? 'active' : ''}" 
                        on:click={() => starActiveEntry.set(entry)}>
                        <StarEntry entryInfo={entry} />
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
