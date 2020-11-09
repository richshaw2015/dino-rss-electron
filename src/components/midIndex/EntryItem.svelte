<script>
    export let entryInfo

    import { rssFeedEntriesView, rssListRsp, unreadCountRsp, rssActiveFeed } from '../utils/store.js'

    const { remote } = require('electron')
    const { Menu, MenuItem } = remote
    import { isWin, getPageSize, shortToast, toast, warnToast, fromNow, isInList, copyToClipboard } from '../utils/helper.js'
    import { apiReq, handleUnsubscribeFeed } from '../utils/req.js'

    function handleMarkEntryAsRead(entry) {
        if (!entry.stats.has_read) {
            apiReq('/api/entry/mark/read', {entries: entry.id}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast("Mark Entry as read")

                    if (isInList(entry, $rssListRsp.data)) {
                        $rssListRsp.data[entry._index].stats.has_read = true
                    }
        
                    $unreadCountRsp.count -= 1

                    if ($rssFeedEntriesView) {
                        $rssActiveFeed.stats.unread_count -= 1
                    }
                }
            }).catch(err => {
                warnToast(err + " Mark")
            })
        }
    }

    export function handleMarkEntryAsUnread(entry) {
        if (entry.stats.has_read) {
            apiReq('/api/entry/mark/unread', {entry_id: entry.id}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast("Mark Entry as unread")

                    if (isInList(entry, $rssListRsp.data)) {
                        $rssListRsp.data[entry._index].stats.has_read = false
                    }
        
                    $unreadCountRsp.count += 1

                    if ($rssFeedEntriesView) {
                        $rssActiveFeed.stats.unread_count += 1
                    }
                }
            }).catch(err => {
                warnToast(err + " Mark")
            })
        }
    }

    function showEntryCtxMenu(entry) {
        const menu = new Menu();
        menu.append(new MenuItem({
            label: isWin() ? "🌟  Star" : "⭐️  Star",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({
            label: "💔  Unstar",
            enabled: false,
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "✅️  Mark as read",
            enabled: !entry.stats.has_read,
            click: function(){
                handleMarkEntryAsRead(entry)
            }
        }));
        menu.append(new MenuItem({
            label: "📌  Mark as unread",
            enabled: entry.stats.has_read,
            click: function(){
                handleMarkEntryAsUnread(entry)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🔗  Copy Link",
            click: function(){
                copyToClipboard(entry.link)
            }
        }));

        menu.append(new MenuItem({type: "separator",}));
        menu.append(new MenuItem({
            label: "✏️  Edit Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));
        menu.append(new MenuItem({
            label: "🗑  Unsubscribe Feed",
            click: function(){
                handleUnsubscribeFeed(entry.feed.id)
            }
        }));

        menu.popup({ window: remote.getCurrentWindow() })
    }
</script>

<style>
    .omr-entry-item {
        width: 100%;
        max-width: 400px;
        user-select: none;
        /*border: 0.5px dashed red;*/
    }
    .entry-title-line {
        display: flex;
        align-items: center;
        height: 34px;
    }
    .entry-meta-line {
        display: flex;
        align-items: flex-start;
        height: 24px;
        font-size: 0.9rem !important;
    }
    .entry-view-stats, .entry-star-stats {
        display: flex;
        align-items: center;
    }
    .entry-star-stats {
        width: 66px;
        padding-right: 24px;
    }
    .entry-view-stats {
        width: 54px;
    }
    .entry-view-stats i {
        font-size: 13px;
        margin-right: 3px;
    }
    .entry-star-stats i {
        font-size: 13px;
        margin-right: 3px;
    }
    .entry-avatar {
        min-width: 24px;
        width: 24px;
        height: 24px;
        margin-right: 6px;
        margin-left: 12px;
    }
    .entry-title {
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
    .entry-author {
        width: 140px;
        padding-left: 12px;
    }
    .entry-date {
        width: 140px;
        padding: 0 10px;
    }
    .podcast-icon {
        width: 13px;
        margin-left: 16px;
    }
</style>

{#if entryInfo}
<div class="omr-entry-item" on:contextmenu={()=> showEntryCtxMenu(entryInfo)}>
    <div class="entry-title-line">
        <img src="{entryInfo.image || 'icon/logo.svg'}" class="entry-avatar" alt="" />
        <span class="truncate entry-title {entryInfo.stats.has_read ? '' : 'bold'}">{ entryInfo.title }</span>

        {#if entryInfo.feed.is_podcast}
            <img src="./icon/podcast.svg" class="podcast-icon" alt="Podcast" />
        {/if}

        <i class="material-icons {entryInfo.stats.has_read ? 'read-icon second-color' : 'unread-icon primary-color'}">
            {entryInfo.stats.has_read ? 'check' : 'lens'}</i>
    </div>

    <div class="entry-meta-line">
        <span class="truncate entry-author">@{entryInfo.author}</span>
        <span class="truncate entry-date">{fromNow(entryInfo.updated)}</span>

        <span class="entry-view-stats">
            <i class="material-icons">visibility</i>
            <span class="uv-stats">{ entryInfo.stats.uv_view }</span>
        </span>

        <span class="entry-star-stats">
            <i class="material-icons {entryInfo.stats.has_starred ? 'primary-color' : ''}">star</i>
            <span class="uv-stats">{ entryInfo.stats.uv_starred }</span>
        </span>
    </div>
</div>
{/if}
