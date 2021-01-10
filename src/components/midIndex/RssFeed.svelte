<script>
    export let feedInfo

    import { createEventDispatcher } from 'svelte'
    import FeedAvatar from '../global/FeedAvatar.svelte'

    const { remote, shell } = require('electron')
    const { Menu, MenuItem } = remote
    const dispatch = createEventDispatcher()

    import { shortToast, toast, warnToast, isInList, fromNow, readableAuthor, readableCount, copyToClipboard }
        from '../utils/helper.js'
    import { apiReq, handleUnsubscribeFeed } from '../utils/req.js'
    import { unreadCountRsp, rssListRsp, rssFeedEntriesView, feedToEdit } from '../utils/store.js'
    
    function handleMarkFeedAsRead(feedInfo) {
        const unreadCount = feedInfo.stats.unread_count

        if (unreadCount > 0) {
            apiReq('/api/entry/mark/read', {entries: feedInfo.stats.unread_list.join(',')}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast("Mark Feed as read")
                    
                    $unreadCountRsp.count -= unreadCount

                    if (isInList(feedInfo, $rssListRsp.data)) {
                        $rssListRsp.data[feedInfo._index].stats.unread_count = 0
                        $rssListRsp.data[feedInfo._index].stats.unread_list = []
                    }
                }
            }).catch(err => {
                warnToast(err + " Mark")
            })
        }
    }
    function handleSyncFeed(feedInfo) {
        apiReq('/api/feed/sync', {feed_id: feedInfo.id}).then( rsp => {
            if (rsp.code === 0) {
                toast("Please wait a moment")
            }
        }).catch(err => {
            warnToast(err + " Sync")
        })
    }

    function showFeedCtxMenu(feedInfo) {
        const menu = new Menu();
        menu.append(new MenuItem({
            label: "✅️  Mark as read",
            click: function(){
                handleMarkFeedAsRead(feedInfo)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: `🧭  Open in Browser`,
            click: function(){
                shell.openExternal(feedInfo.link)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: `📋  Copy RSS`,
            click: function(){
                copyToClipboard(feedInfo.rss)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: `🔄  Sync`,
            click: function(){
                handleSyncFeed(feedInfo)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "✏️  Edit",
            click: function(){
                feedToEdit.set(feedInfo)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🗑  Unsubscribe",
            click: function(){
                handleUnsubscribeFeed(feedInfo.id)
            }
        }));
        menu.popup({ window: remote.getCurrentWindow() })
    }
</script>

<style>
    .omr-feed-item {
        width: 100%;
        max-width: 400px;
        user-select: none;
        /*border: 0.5px dashed red;*/
    }
    .feed-title-line {
        display: flex;
        align-items: center;
        height: 34px;
    }
    .feed-meta-line {
        display: flex;
        align-items: flex-start;
        height: 24px;
        font-size: 0.9rem !important;
    }
    .feed-update-stats, .feed-toread-stats {
        display: flex;
        align-items: center;
    }
    .feed-toread-stats {
        min-width: 60px;
    }
    .feed-update-stats {
        width: 54px;
    }
    .feed-update-stats i {
        font-size: 13px;
        margin-right: 3px;
    }
    .feed-toread-stats i {
        font-size: 11px;
        margin-right: 3px;
    }
    .feed-title {
        flex-grow: 1;
    }
    .read-icon, .unread-icon {
        width: 16px;
        margin-left: 16px;
    }
    .padding-icon {
        margin-right: 12px;
    }
    .read-icon {
        font-size: 16px;
    }
    .unread-icon {
        font-size: 12px;
    }
    .sync-err-icon {
        font-size: 16px;
        margin-left: 16px;
        color: #f6a433;
    }
    .podcast-icon {
        width: 13px;
        margin-left: 16px;
    }
    .feed-author {
        width: 130px;
        padding-left: 12px;
        flex-grow: 1;
    }
    .feed-date {
        width: 130px;
        min-width: 130px;
        padding: 0 8px;
    }

</style>

{#if !$rssFeedEntriesView}
<div class="omr-feed-item" title="{feedInfo.title}" on:contextmenu={() => showFeedCtxMenu(feedInfo)}>
    <div class="feed-title-line">
        <FeedAvatar feedImage="{feedInfo.image}" feedId="{feedInfo.id}" />

        <span class="truncate feed-title {feedInfo.stats.unread_count > 0 ? 'bold' : ''}">
            { feedInfo.custom.title || feedInfo.title }</span>

        {#if feedInfo.is_podcast}
            <img src="./icon/podcast.svg" class="podcast-icon" alt="Podcast" />
        {/if}

        {#if feedInfo.is_active === false}
            <i class="material-icons sync-err-icon">sync_disabled</i>
        {/if}

        <i class="material-icons padding-icon {feedInfo.stats.unread_count > 0 ? 'unread-icon primary-color' : 'read-icon second-color'}">
            {feedInfo.stats.unread_count > 0 ? 'lens' : 'check'}</i>
    </div>

    <div class="feed-meta-line">
        <span class="truncate feed-author">@{ readableAuthor(feedInfo.custom.author || feedInfo.author) }</span>
        <span class="truncate feed-date">{fromNow(feedInfo.stats.update_ts)}</span>

        <span class="feed-update-stats">
            <i class="material-icons">sync</i>
            <span class="uv-stats">{ readableCount(feedInfo.stats.update_count) || 0 }</span>
        </span>

        <span class="feed-toread-stats">
            <i class="material-icons">lens</i>
            <span class="uv-stats">{ feedInfo.stats.unread_count }</span>
        </span>
    </div>
</div>
{/if}
