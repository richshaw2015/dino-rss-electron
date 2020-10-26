<script>
    export let listRsp = {}

    import FeedItem from './FeedItem.svelte'
    import Common from '../global/Common.svelte'
    import Notice from '../global/Notice.svelte'
    import FeedNav from './FeedNav.svelte'
    import Pager from './Pager.svelte'
    import Toolbar from './Toolbar.svelte'
    import EntryItem from "./EntryItem.svelte"
    import { getPageSize } from '../utils/helper.js'
    import { shortToast, toast, warnToast } from '../utils/toast.js'
    import { apiReq } from '../utils/req.js'
    import { saveViewMode } from '../utils/storage.js'
    import { viewMode, viewScope, activeEntry, activeFeed, isFeedEntriesView, feedListRspBak } 
        from '../store/store.js'

    import { onMount } from 'svelte'

    onMount(() => {
        // first list request
        updateList(1, $viewMode)

        activeFeed.subscribe(feed => {
            if (feed.id) {
                console.log(feed)
                gotoFeedEntries(feed, 1, true)
            }
        });
    })

    function updateList(page, mode) {
        if (!mode) mode = $viewMode

        if (mode === 'feed') {
            apiReq('/api/my/feeds', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                listRsp.code = rsp.code || 0
                listRsp.data = rsp.data

                if (rsp.code === 0) {
                    viewMode.set(mode)

                    listRsp.page = rsp.page
                    listRsp.num_pages = rsp.num_pages

                    saveViewMode(mode)
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
        } else if (mode === 'entry') {
            apiReq('/api/my/entries', {page: page, page_size: getPageSize(), scope: $viewScope}).then( rsp => {
                listRsp.code = rsp.code || 0
                listRsp.data = rsp.data

                if (rsp.code === 0) {
                    viewMode.set(mode)

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

    function gotoFeedEntries(feed, page=1, saveCtx=false) {
        apiReq('/api/feed/entries', {
            feed_id: feed.id,
            page: page,
            page_size: getPageSize() - 1, 
            scope: $viewScope
        }).then( rsp => {
            if (rsp.code === 0 || rsp.code === 101) {
                if (saveCtx) {
                    isFeedEntriesView.set(true)
                    feedListRspBak.set(listRsp)
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

    function handleToolbarRefresh(event) {
        if ($isFeedEntriesView) {
            gotoFeedEntries($activeFeed, event.detail.page, false)
        } else {
            updateList(event.detail.page, event.detail.mode)
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

<Common bind:listRsp />
<Toolbar showModeBtn={!$isFeedEntriesView} on:refresh-list-view={handleToolbarRefresh} />

{#if $isFeedEntriesView}
    <FeedNav bind:listRsp />

    {#if listRsp.code === 101}
        <Notice level="succ" msg={listRsp.msg} />
    {:else}
        <div class="list-wrapper">
            <ul class="collection list-ul">
                {#each listRsp.data as entry (entry.id)}
                <li class="collection-item list-li { entry.id === $activeEntry.id ? 'active' : ''}" 
                    on:click={() => activeEntry.set(entry)}>
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
                    <li class="collection-item list-li { feed.id === $activeFeed.id ? 'active' : '' }" 
                        on:click={() => activeFeed.set(feed)}>
                        <FeedItem feedInfo={feed} />
                    </li>
                {/each}

            {:else if $viewMode === 'entry'}
                {#each listRsp.data as entry, index (entry.id)}
                    <li class="collection-item list-li { entry.id === $activeEntry.id ? 'active' : ''}" 
                        on:click={() => activeEntry.set(entry)}>
                        <EntryItem entryInfo={entry}  />
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
