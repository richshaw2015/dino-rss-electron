<script>
    export let feedInfo

    import { fromNow } from '../utils/helper.js'

    const { remote, shell } = require('electron')
    const { Menu, MenuItem } = remote
    import { isWin, getPageSize, shortToast, toast, warnToast, copyToClipboard, isInList } from '../utils/helper.js'
    import { apiReq, handleUnsubscribeFeed } from '../utils/req.js'
    import { unreadCountRsp, rssListRsp } from '../utils/store.js'
    
    function handleMarkFeedAsRead(feedInfo) {
        const unreadCount = feedInfo.stats.unread_count

        if (unreadCount > 0) {
            apiReq('/api/entry/mark/read', {entries: feedInfo.stats.unread_list.join(',')}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast("Mark Feed as read")
                    
                    if (isInList(feedInfo, $rssListRsp.data)) {
                        $rssListRsp.data[feedInfo._index].stats.unread_count = 0
                        $rssListRsp.data[feedInfo._index].stats.unread_list = []
                    }

                    $unreadCountRsp.count -= unreadCount
                }
            }).catch(err => {
                warnToast(err + " Mark")
            })
        }
    }
    // TODO dynamic read/unread star/unstar menu
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
            label: `🔗  Open ${feedInfo.link}`,
            click: function(){
                shell.openExternal(feedInfo.link)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "✏️  Edit",
            click: function(){
                // TODO 
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
        width: 66px;
        padding-right: 24px;
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
    .feed-avatar {
        min-width: 24px;
        width: 24px;
        height: 24px;
        margin-right: 6px;
        margin-left: 12px;
    }
    .feed-title {
        flex-grow: 1;
    }
    .read-icon, .unread-icon {
        width: 16px;
        margin-left: 16px;
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
        width: 140px;
        padding-left: 12px;
    }
    .feed-date {
        width: 140px;
        padding: 0 10px;
    }

</style>

{#if feedInfo}
<div class="omr-feed-item" on:contextmenu={() => showFeedCtxMenu(feedInfo)}>
    <div class="feed-title-line">
        <img src="{feedInfo.image || 'icon/logo.svg'}" class="feed-avatar" alt="" />
        <span class="truncate feed-title {feedInfo.stats.unread_count > 0 ? 'bold' : ''}">{ feedInfo.title }</span>

        {#if feedInfo.is_podcast}
            <img src="./icon/podcast.svg" class="podcast-icon" alt="Podcast" />
        {/if}

        {#if feedInfo.is_active === false}
            <i class="material-icons sync-err-icon">sync_disabled</i>
        {/if}

        <i class="material-icons {feedInfo.stats.unread_count > 0 ? 'unread-icon primary-color' : 'read-icon second-color'}">
            {feedInfo.stats.unread_count > 0 ? 'lens' : 'check'}</i>
    </div>

    <div class="feed-meta-line">
        <span class="truncate feed-author">@{feedInfo.author}</span>
        <span class="truncate feed-date">{fromNow(feedInfo.stats.update_ts)}</span>

        <span class="feed-update-stats">
            <i class="material-icons">sync</i>
            <span class="uv-stats">{ feedInfo.stats.update_count }</span>
        </span>

        <span class="feed-toread-stats">
            <i class="material-icons">lens</i>
            <span class="uv-stats">{ feedInfo.stats.unread_count }</span>
        </span>
    </div>
</div>
{/if}
