<script>
    import {saveFeedTagInfo, saveTagCountInfo} from "../utils/storage";

    export let feedInfo
    let tooltipInstance = null

    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import FeedAvatar from '../global/FeedAvatar.svelte'

    const { shell, nativeImage} = require('electron')
    const { Menu, MenuItem, app } = require('@electron/remote')
    const path = require('path');
    const appPath = app.getAppPath();
    const dispatch = createEventDispatcher()

    import {
        shortToast,
        toast,
        warnToast,
        isInList,
        fromNow,
        readableAuthor,
        readableCount,
        copyToClipboard,
        i18n,
        calTagCountMap, getTagSrc
    } from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    import {
        unreadCountRsp,
        rssListRsp,
        rssFeedEntriesView,
        feedToEdit,
        tagCountMap,
        feedTagMap,
        isTagSynced
    } from '../utils/store.js'
    import { Tags } from '../utils/constant.js'

    onMount(() => {
        const el = '#RssFeed' + feedInfo.id;
        tooltipInstance = M.Tooltip.init(document.querySelector(el), {"outDuration": 0, "enterDelay": 20, "inDuration": 30});

    })
    onDestroy(() => {
        if (tooltipInstance !== null) {
            tooltipInstance.destroy()
        }
    });

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
                } else {
                    warnToast(i18n("unknown.error"))
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
            } else {
                warnToast(i18n("unknown.error"))
            }
        }).catch(err => {
            warnToast(err)
        })
    }

    function handleUnsubscribeFeed(feedId) {
        apiReq('/api/feed/unsubscribe', {feed_id: feedId}).then( rsp => {
            if (rsp.code === 0) {
                shortToast(i18n("unsubscribed"))

                // sync tag info
                feedTagMap.set(rsp.data)
                tagCountMap.set(calTagCountMap(rsp.data))
                isTagSynced.set(true)

                saveFeedTagInfo($feedTagMap)
                saveTagCountInfo($tagCountMap)
            } else {
                warnToast(i18n("unknown.error"))
            }
        }).catch(err => {
            warnToast(err)
        })
    }

    function updateFeedTag(feedId, tagId) {
        apiReq('/api/tag/feed', {feed_id: feedId, tag_id: tagId}).then( rsp => {
            feedTagMap.set(rsp)
            tagCountMap.set(calTagCountMap(rsp))
            isTagSynced.set(true)

            saveFeedTagInfo($feedTagMap)
            saveTagCountInfo($tagCountMap)
        }).catch(err => {
            warnToast(err)
        })
    }

    function showFeedCtxMenu(feedInfo) {
        const menu = new Menu();

        const redIcon = nativeImage.createFromPath(path.join(appPath, "public/icon/tag/red.png"));
        const yellowIcon = nativeImage.createFromPath(path.join(appPath, "public/icon/tag/yellow.png"));
        const greenIcon = nativeImage.createFromPath(path.join(appPath, "public/icon/tag/green.png"));
        const blueIcon = nativeImage.createFromPath(path.join(appPath, "public/icon/tag/blue.png"));
        const purpleIcon = nativeImage.createFromPath(path.join(appPath, "public/icon/tag/purple.png"));
        const greyIcon = nativeImage.createFromPath(path.join(appPath, "public/icon/tag/grey.png"));

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
                    checked: $feedTagMap[feedInfo.id] === Tags.red,
                    click: function () {
                        updateFeedTag(feedInfo.id, Tags.red);
                    }
                }),
                new MenuItem({
                    icon: yellowIcon,
                    label: " Yellow",
                    checked: $feedTagMap[feedInfo.id] === Tags.yellow,
                    type: "radio",
                    click: function () {
                        updateFeedTag(feedInfo.id, Tags.yellow);
                    }
                }),
                new MenuItem({
                    icon: greenIcon,
                    label: " Green",
                    type: "radio",
                    checked: $feedTagMap[feedInfo.id] === Tags.green,
                    click: function () {
                        updateFeedTag(feedInfo.id, Tags.green);
                    }
                }),
                new MenuItem({
                    icon: blueIcon,
                    label: " Blue",
                    type: "radio",
                    checked: $feedTagMap[feedInfo.id] === Tags.blue,
                    click: function () {
                        updateFeedTag(feedInfo.id, Tags.blue);
                    }
                }),
                new MenuItem({
                    icon: purpleIcon,
                    label: " Purple",
                    type: "radio",
                    checked: $feedTagMap[feedInfo.id] === Tags.purple,
                    click: function () {
                        updateFeedTag(feedInfo.id, Tags.purple);
                    }
                }),
                new MenuItem({
                    icon: greyIcon,
                    label: "️ Grey",
                    type: "radio",
                    checked: $feedTagMap[feedInfo.id] === Tags.grey,
                    click: function () {
                        updateFeedTag(feedInfo.id, Tags.grey);
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
    }

    .feed-title-line {
        display: flex;
        align-items: center;
        height: 34px;
    }
    .feed-meta-line {
        display: flex;
        align-items: center;
        height: 24px;
        font-size: 0.85rem !important;
    }
    .feed-update-stats, .feed-toread-stats {
        display: flex;
        align-items: center;
    }
    .feed-toread-stats {
        min-width: 54px;
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
        width: 120px;
        flex-grow: 1;
    }
    .feed-tag {
        margin-left: 12px;
        margin-right: 6px;
        width: 12px;
    }
    .feed-tag-default {
        font-size: 13px;
    }
    .feed-date {
        width: 120px;
        min-width: 120px;
        padding: 0 4px;
    }

</style>

{#if !$rssFeedEntriesView}
<div class="omr-feed-item tooltipped" id="RssFeed{feedInfo.id}" data-position="right" data-tooltip="{feedInfo.title}"
     on:contextmenu={() => showFeedCtxMenu(feedInfo)}>
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
        {#if $feedTagMap[feedInfo.id]}
            <img class="feed-tag" src="{getTagSrc($feedTagMap[feedInfo.id])}" alt="Tag" />
        {:else}
            <i class="material-icons feed-tag feed-tag-default">add_alert</i>
        {/if}
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
