<script>
    import RssFeed from './RssFeed.svelte'
    import Notice from '../global/Notice.svelte'
    import FeedNav from './FeedNav.svelte'
    import Pager from './Pager.svelte'
    import Tag from './Tag.svelte'
    import Toolbar from './Toolbar.svelte'
    import RssEntry from "./RssEntry.svelte"
    import { getPageSize, isInList, shortToast, toast, warnToast, setBadge, i18n, calTagCountMap } from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    import { saveRssViewMode, saveFeedTagInfo, saveTagCountInfo } from '../utils/storage.js'
    import { rssViewMode, viewScope, rssActiveEntry, rssActiveFeed, rssListRsp, rssFeedListRspBak, rssFeedEntriesView, 
        unreadCountRsp, activeTag, feedTagMap, tagCountMap, isTagSynced} from '../utils/store.js'

    import { onMount, onDestroy } from 'svelte'

    const Mousetrap = require('mousetrap')
    
    onMount(() => {
        // sync feed tag info
        if ($rssViewMode === 'feed' && !$isTagSynced) {
            console.log('sync tag info')
            apiReq('/api/my/tags', {}).then(rsp => {
                feedTagMap.set(rsp)
                tagCountMap.set(calTagCountMap(rsp))
                isTagSynced.set(true)

                saveFeedTagInfo($feedTagMap)
                saveTagCountInfo($tagCountMap)
            }).catch(err => {
                toast(err)
            })
        }

        // first list request
        if(!$rssFeedEntriesView) {
            if (!$rssListRsp.page || $rssListRsp.page === 1) {
                updateRssList(1, $rssViewMode)
            }
        }
        
        // keyboard shortcut
        Mousetrap.bind(['n', 'down'], function() {
            if ($rssListRsp.code !== 0 || $rssListRsp.data.length === 0) {
                return false
            }
            if ($rssViewMode === 'entry' || ($rssViewMode === 'feed' && $rssFeedEntriesView) ) {
                if (!isInList($rssActiveEntry, $rssListRsp.data)) {
                    rssActiveEntry.set($rssListRsp.data[0])
                } else {
                    const index = $rssActiveEntry._index + 1
                    if (index === $rssListRsp.data.length) {
                        warnToast(i18n("already.last.entry"))
                    } else {
                        rssActiveEntry.set($rssListRsp.data[index])
                    }
                }
            } else if ($rssViewMode === 'feed' && !$rssFeedEntriesView) {
                if (!isInList($rssActiveFeed, $rssListRsp.data)) {
                    handleGotoFeedEntries($rssListRsp.data[0])
                } else {
                    const index = $rssActiveFeed._index + 1
                    if (index === $rssListRsp.data.length) {
                        warnToast(i18n("already.last.feed"))
                    } else {
                        handleGotoFeedEntries($rssListRsp.data[index])
                    }
                }
            }
            return false
        });
        Mousetrap.bind(['N', 'up'], function() {
            if ($rssListRsp.data.length === 0 || $rssListRsp.code !== 0) {
                return false
            }
            if ($rssViewMode === 'entry' || ($rssViewMode === 'feed' && $rssFeedEntriesView) ) {
                if (!isInList($rssActiveEntry, $rssListRsp.data)) {
                    activeEntry.set($rssListRsp.data[0])
                } else {
                    const index = $rssActiveEntry._index - 1
                    if (index < 0) {
                        warnToast(i18n("already.first.entry"))
                    } else {
                        rssActiveEntry.set($rssListRsp.data[index])
                    }
                }
            } else if ($rssViewMode === 'feed' && !$rssFeedEntriesView) {
                if (!isInList($rssActiveFeed, $rssListRsp.data)) {
                    handleGotoFeedEntries($rssListRsp.data[0])
                } else {
                    const index = $rssActiveFeed._index - 1
                    if (index < 0 ) {
                        warnToast(i18n("already.first.feed"))
                    } else {
                        handleGotoFeedEntries($rssListRsp.data[index])
                    }
                }
            }
            return false
        });

        const syncUnreadInterval = setInterval(syncUnreadCount, 3600*1000)

        return () => clearInterval(syncUnreadInterval)
    })

    const tagSub = activeTag.subscribe(tag => {
        if (tag >= 0) {
            updateRssList(1, $rssViewMode)
        }
        return tag
    });

    const unreadCountSub = unreadCountRsp.subscribe(rsp => {
        if (rsp.code === 0) {
            if (rsp.count < 0) {
                rsp.code = -1
                syncUnreadCount()
            } else {
                setBadge($unreadCountRsp.count)
            }
        }
        return rsp
    });

    onDestroy(tagSub);
    onDestroy(unreadCountSub);

    function handleGotoFeedEntries(feed, page) {
        if (!$rssFeedEntriesView && $rssViewMode === "feed") {
            rssActiveFeed.set(feed)
            gotoFeedEntries(page)
        }
    }

    function syncUnreadCount() {
        apiReq('/api/count/unread', {tag: $activeTag}).then(rsp => {
            if (rsp.code === 0) {
                unreadCountRsp.set(rsp)
            }
        }).catch(err => {
            toast(err)
        })
    }

    function updateRssList(page, mode) {
        if (!mode) mode = $rssViewMode

        if (mode === 'feed') {
            apiReq('/api/my/feeds', {page: page, page_size: getPageSize(), scope: $viewScope, tag: $activeTag}).then( rsp => {
                if (!$rssFeedEntriesView) {
                    rssListRsp.set(rsp)

                    if (!$rssFeedEntriesView) {
                        rssFeedListRspBak.set(rsp)
                    }

                    if (rsp.code === 0) {
                        if ($rssViewMode !== mode) {
                            rssViewMode.set(mode)
                            saveRssViewMode(mode)
                        }
                    } else if (rsp.code === 100) {
                        $rssListRsp.msg = i18n('no.updated.feed')
                    }  else if (rsp.code === 101) {
                        $rssListRsp.msg = i18n('no.unread.feed')
                    }
                }
            }).catch(err => {
                rssListRsp.set({
                    "code": -1,
                    "msg": err
                })
                warnToast($rssListRsp.msg)
            })
        } else if (mode === 'entry') {
            apiReq('/api/my/entries', {page: page, page_size: getPageSize(), scope: $viewScope, tag: $activeTag}).then( rsp => {
                rssListRsp.set(rsp)

                if (rsp.code === 0) {
                    if ($rssViewMode !== mode) {
                        rssViewMode.set(mode)
                        saveRssViewMode(mode)
                    }
                } else if (rsp.code === 100) {
                    $rssListRsp.msg = i18n("no.updated.entry")
                } else if (rsp.code === 101) {
                    $rssListRsp.msg = i18n("no.unread.entry")
                }
            }).catch(err => {
                rssListRsp.set({
                    "code": -1,
                    "msg": err
                })
                warnToast($rssListRsp.msg)
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
            if (!$rssFeedEntriesView) {
                rssFeedEntriesView.set(true)
            }
            rssListRsp.set(rsp)

            if (rsp.code === 101) {
                $rssListRsp.msg = i18n('no.unread.entry')
            } else if (rsp.code === 100) {
                $rssListRsp.msg = i18n('no.updated.entry')
            }
        }).catch(err => {
            warnToast(err)
        })
    }

    function handleToolbarRefresh(event) {
        if ($rssFeedEntriesView) {
            gotoFeedEntries(event.detail.page)
        } else {
            updateRssList(event.detail.page, event.detail.mode)
        }
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
                    <RssEntry entryInfo={entry} />
                </li>
                {/each}
            </ul>
        </div>

        <Pager currentPage={$rssListRsp.page} numPages={$rssListRsp.num_pages} 
            on:refresh-list-view={handleToolbarRefresh} />
    {/if}
{:else}
    <Tag countMap="{$tagCountMap}" />

    {#if $rssListRsp.code === undefined}
        <!-- loading -->
        <Notice />
    {:else if $rssListRsp.code === -1}
        <Notice level="warn" msg={$rssListRsp.msg} />
    {:else if $rssListRsp.code === 0}
        <div class="list-wrapper">
            <ul class="collection list-ul">
            {#if $rssViewMode === 'feed'}
                {#each $rssListRsp.data as feed (feed.id)}
                    <li class="collection-item list-li { feed.id === $rssActiveFeed.id ? 'active' : '' }" 
                        on:click={() => handleGotoFeedEntries(feed)}>
                        <RssFeed feedInfo={feed} />
                    </li>
                {/each}

            {:else if $rssViewMode === 'entry'}
                {#each $rssListRsp.data as entry (entry.id)}
                    <li class="collection-item list-li { entry.id === $rssActiveEntry.id ? 'active' : ''}" 
                        on:click={() => rssActiveEntry.set(entry)}>
                        <RssEntry entryInfo={entry} />
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
