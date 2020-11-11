<script>
    import { onMount } from 'svelte'
    import { rssActiveFeed, rssEntryListRsp, rssFeedListRsp, rssFeedEntriesView, unreadCountRsp } from '../utils/store.js'
    import { apiReq } from '../utils/req.js'
    import { warnToast, shortToast, readableCount } from '../utils/helper.js'
    import { getViewScope } from '../utils/storage.js'

    const Mousetrap = require('mousetrap')

    function backToFeedList() {
        rssFeedEntriesView.set(false)
        rssEntryListRsp.set($rssFeedListRsp)
    }
    function handleMarkFeedAsRead() {
        const unreadCount = $rssActiveFeed.stats.unread_count

        if (unreadCount > 0) {
            apiReq('/api/entry/mark/read', {entries: $rssActiveFeed.stats.unread_list.join(',')}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast("Mark Feed as read")

                    $rssActiveFeed.stats.unread_count = 0
                    $rssActiveFeed.stats.unread_list = []

                    $unreadCountRsp.count -= unreadCount
                    
                    if (getViewScope() === 'unread') {
                        rssEntryListRsp.set({
                            "code": 101,
                            "msg": "No unread Entries"
                        })
                    } else {
                        for (let i in $rssEntryListRsp.data) {
                            $rssEntryListRsp.data[i].stats.has_read = true
                        }
                    }
                }
            }).catch(err => {
                warnToast(err + " Mark")
            })
        }
    }

    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind('b', function() {
            backToFeedList()
            return false
        });
    })
</script>

<style>
    #omr-feed-nav {
        width: 100%;
        max-width: 400px;
        display: flex;
        align-items: center;
        height: 48px;
        min-height: 48px;
        border-bottom: 1px dashed rgba(0,0,0,.14);
    }
    .feed-nav-avatar {
        min-width: 24px;
        width: 24px;
        height: 24px;
        margin-left: 18px;
        margin-right: 6px;
    }
    .feed-nav-title {
        flex-grow: 1;
    }
    .feed-nav-unread {
        min-width: 1rem;
        flex-grow: 50;
    }
    .back-icon {
        margin-left: 6px;
        margin-right: 6px;
    }
    .check-icon {
        margin-left: 18px;
        margin-right: 6px;
    }
    #omr-feed-back {
        display: flex;
        align-items: center;
        width: 64px;
        cursor: pointer;
    }

</style>

{#if $rssFeedEntriesView}
<div id="omr-feed-nav">
    <div id="omr-feed-back" on:click={backToFeedList}>
        <i class="material-icons back-icon">arrow_back</i>
        <span class="">Back</span>
    </div>

    <img src="{$rssActiveFeed.image || 'icon/logo.svg'}" class="feed-nav-avatar" alt="" />
    <span class="truncate bold feed-nav-title" title="{$rssActiveFeed.title}">{$rssActiveFeed.title}</span>
    {#if $rssActiveFeed.stats.unread_count > 0}
        <span class="bold feed-nav-unread">({readableCount($rssActiveFeed.stats.unread_count)})</span>
    {/if}

    <i class="material-icons check-icon" on:click={handleMarkFeedAsRead}>check</i>
</div>
{/if}
