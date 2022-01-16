<script>
    export let feedInfo

    import { createEventDispatcher } from 'svelte'
    import FeedAvatar from '../global/FeedAvatar.svelte'

    const { shell, nativeImage} = require('electron')
    const { Menu, MenuItem } = require('@electron/remote')
    const dispatch = createEventDispatcher()

    import { shortToast, toast, warnToast, isInList, fromNow, readableAuthor, readableCount, copyToClipboard, i18n }
        from '../utils/helper.js'
    import { apiReq, handleUnsubscribeFeed } from '../utils/req.js'
    import { unreadCountRsp, rssListRsp, rssFeedEntriesView, feedToEdit } from '../utils/store.js'
    import { Tags } from '../utils/constant.js'

    function handleMarkFeedAsRead(feedInfo) {
        const unreadCount = feedInfo.stats.unread_count

        if (unreadCount > 0) {
            apiReq('/api/entry/mark/read', {entries: feedInfo.stats.unread_list.join(',')}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast(i18n("mark.as.read"))
                    
                    $unreadCountRsp.count -= unreadCount

                    if (isInList(feedInfo, $rssListRsp.data)) {
                        $rssListRsp.data[feedInfo._index].stats.unread_count = 0
                        $rssListRsp.data[feedInfo._index].stats.unread_list = []
                    }
                }
            }).catch(err => {
                warnToast(err)
            })
        }
    }
    function handleSyncFeed(feedInfo) {
        apiReq('/api/feed/sync', {feed_id: feedInfo.id}).then( rsp => {
            if (rsp.code === 0) {
                toast(i18n("wait.a.moment"))
            }
        }).catch(err => {
            warnToast(err)
        })
    }

    function showFeedCtxMenu(feedInfo) {
        const menu = new Menu();
        const redIcon = nativeImage.createFromPath("public/icon/tag/red.png");
        const yellowIcon = nativeImage.createFromPath("public/icon/tag/yellow.png")
        const greenIcon = nativeImage.createFromPath("public/icon/tag/green.png")
        const blueIcon = nativeImage.createFromPath("public/icon/tag/blue.png")
        const purpleIcon = nativeImage.createFromPath("public/icon/tag/purple.png")
        const greyIcon = nativeImage.createFromPath("public/icon/tag/grey.png")

        menu.append(new MenuItem({
            label: "✅️  " + i18n("mark.as.read"),
            click: function(){
                handleMarkFeedAsRead(feedInfo)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🧭  " + i18n("open.in.browser"),
            click: function(){
                shell.openExternal(feedInfo.link)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "📋  " + i18n("copy.rss"),
            click: function(){
                copyToClipboard(feedInfo.rss)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🔄  " + i18n("sync"),
            click: function(){
                handleSyncFeed(feedInfo)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "✏️  " + i18n("edit"),
            click: function(){
                feedToEdit.set(feedInfo)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🗂  " + i18n("tag"),
            submenu: [
                new MenuItem({
                    icon: redIcon,
                    label: " Red",
                    type: "radio",
                    checked: feedInfo.tag === Tags.red,
                    click: function () {
                        // TOD
                    }
                }),
                new MenuItem({
                    icon: yellowIcon,
                    label: " Yellow",
                    checked: feedInfo.tag === Tags.yellow,
                    type: "radio",
                    click: function () {
                        // TODO
                    }
                }),
                new MenuItem({
                    icon: greenIcon,
                    label: " Green",
                    type: "radio",
                    checked: feedInfo.tag === Tags.green,
                    click: function () {
                        // TODO
                    }
                }),
                new MenuItem({
                    icon: blueIcon,
                    label: " Blue",
                    type: "radio",
                    checked: feedInfo.tag === Tags.blue,
                    click: function () {
                        // TODO
                    }
                }),
                new MenuItem({
                    icon: purpleIcon,
                    label: " Purple",
                    type: "radio",
                    checked: feedInfo.tag === Tags.purple,
                    click: function () {
                        // TODO
                    }
                }),
                new MenuItem({
                    icon: greyIcon,
                    label: "️ Grey",
                    type: "radio",
                    checked: feedInfo.tag === Tags.grey,
                    click: function () {
                        // TODO
                    }
                })
            ]
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🗑  " + i18n("unsubscribe"),
            click: function(){
                handleUnsubscribeFeed(feedInfo.id)
            }
        }));
        menu.popup({ window: require('@electron/remote').getCurrentWindow() })
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
