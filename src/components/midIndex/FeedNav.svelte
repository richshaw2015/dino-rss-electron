<script>
    import { onMount } from 'svelte'
    import { rssActiveFeed, rssListRsp, rssFeedListRspBak, rssFeedEntriesView, unreadCountRsp, activeTab, 
        starActiveFeed, starFeedEntriesView, starFeedListRspBak, starListRsp } from '../utils/store.js'
    import { apiReq } from '../utils/req.js'
    import { warnToast, shortToast, readableCount, i18n } from '../utils/helper.js'
    import { getViewScope } from '../utils/storage.js'

    const Mousetrap = require('mousetrap')

    function backToFeedList() {
        if ($activeTab === "rss" && $rssFeedEntriesView) {
            rssFeedEntriesView.set(false)
            rssListRsp.set($rssFeedListRspBak)
        } else if ($activeTab === "star" && $starFeedEntriesView) {
            starFeedEntriesView.set(false)
            starListRsp.set($starFeedListRspBak)
        }
    }

    function handleMarkFeedAsRead() {
        const unreadCount = $rssActiveFeed.stats.unread_count
        const feedId = $rssActiveFeed.id

        if (unreadCount > 0) {
            apiReq('/api/entry/mark/read', {entries: $rssActiveFeed.stats.unread_list.join(',')}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast(i18n('mark.as.read'))
                    
                    $unreadCountRsp.count -= unreadCount

                    if ($rssFeedEntriesView && $rssActiveFeed.id === feedId) {
                        $rssActiveFeed.stats.unread_count = 0
                        $rssActiveFeed.stats.unread_list = []

                        if (getViewScope() === 'unread') {
                            rssListRsp.set({
                                "code": 101,
                                "msg": i18n("no.unread.entries")
                            })
                        } else {
                            for (let i in $rssListRsp.data) {
                                $rssListRsp.data[i].stats.has_read = true
                            }
                        }
                    }
                } else {
                    warnToast(i18n("unknown.error"))
                }
            }).catch(err => {
                warnToast(err)
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
    }
    .feed-nav-title {
        flex-grow: 1;
    }
    .feed-nav-unread {
        min-width: 1rem;
        padding-left: 4px;
        color: #757575;
    }
    .padding-space {
        flex-grow: 50;
    }
    .back-icon {
        margin-left: 6px;
        margin-right: 6px;
    }
    .check-icon {
        margin-left: 12px;
        margin-right: 6px;
    }
    #omr-feed-back {
        display: flex;
        align-items: center;
        width: 80px;
        min-width: 80px;
        cursor: pointer;
    }
    #omr-feed-back span {
        font-size: 14px;
    }

    @media (prefers-color-scheme: dark) {
        #omr-feed-nav {
            border-color: #373737;
        }
        .feed-nav-unread {
            color: rgb(157, 157, 161);
        }
    }
</style>

{#if $activeTab === "rss"}
    <div id="omr-feed-nav">
        <div title="{i18n('back')}" id="omr-feed-back" on:click={backToFeedList}>
            <i class="material-icons back-icon">arrow_back</i>
            <span class="">{i18n('back')}</span>
        </div>

        <span class="truncate bold feed-nav-title" title="{$rssActiveFeed.title}">
            {$rssActiveFeed.custom.title || $rssActiveFeed.title}</span>
        {#if $rssActiveFeed.stats.unread_count > 0}
            <span class="bold feed-nav-unread">({readableCount($rssActiveFeed.stats.unread_count)})</span>
        {/if}
        <span class="padding-space"></span>

        <i title="{i18n('mark.as.read')}" class="material-icons check-icon" on:click={handleMarkFeedAsRead}>check</i>
    </div>
{:else if $activeTab === "star"}
    <div id="omr-feed-nav">
        <div title="{i18n('back')}" id="omr-feed-back" on:click={backToFeedList}>
            <i class="material-icons back-icon">arrow_back</i>
            <span class="">{i18n('back')}</span>
        </div>

        <span class="truncate bold feed-nav-title" title="{$starActiveFeed.title}">
            {$starActiveFeed.custom.title || $starActiveFeed.title}</span>
    </div>
{/if}
