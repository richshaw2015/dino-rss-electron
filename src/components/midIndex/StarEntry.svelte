<script>
    import {onDestroy, onMount} from "svelte";

    export let entryInfo
    let tooltipInstance = null

    import { starListRsp, starActiveEntry } from '../utils/store.js'
    import { readableAuthor, i18n, convHtml } from '../utils/helper.js'

    const { shell } = require('electron')
    const { Menu, MenuItem } = require('@electron/remote')
    import { isWin, isLinux, shortToast, toast, warnToast, fromNow, isInList, copyToClipboard } from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    import FeedAvatar from '../global/FeedAvatar.svelte'

    function handleStarEntry(entry) {
        if (!entry.stats.has_starred) {
            apiReq('/api/star/entry', {entry_id: entry.id, feed_id: entry.feed.id}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast(i18n("starred"))

                    if (isInList(entry, $starListRsp.data)) {
                        $starListRsp.data[entry._index].stats.has_starred = true
                    }
                    if (entry.id === $starActiveEntry.id) {
                        $starActiveEntry.stats.has_starred = true
                    }
                } else if (rsp.code === 109) {
                    warnToast(i18n("max.stars.limit"))
                } else {
                    warnToast(i18n("unknown.error"))
                }
            }).catch(err => {
                warnToast(err)
            })
        }
    }

    function handleUnstarEntry(entry) {
        if (entry.stats.has_starred) {
            apiReq('/api/unstar/entry', {entry_id: entry.id, feed_id: entry.feed.id}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast(i18n("unstar"))

                    if (isInList(entry, $starListRsp.data)) {
                        $starListRsp.data[entry._index].stats.has_starred = false
                    }
                    if (entry.id === $starActiveEntry.id) {
                        $starActiveEntry.stats.has_starred = false
                    }
                } else {
                    warnToast(i18n("unknown.error"))
                }
            }).catch(err => {
                warnToast(err)
            })
        }
    }

    function showEntryCtxMenu(entry) {
        const menu = new Menu();

        menu.append(new MenuItem({
            label: isWin() || isLinux() ? "🌟  " + i18n('star') : "⭐️  " + i18n('star'),
            visible: !entry.stats.has_starred,
            click: function(){
                handleStarEntry(entry)
            }
        }));
        menu.append(new MenuItem({
            label: "💔  " + i18n('unstar'),
            visible: entry.stats.has_starred,
            click: function(){
                handleUnstarEntry(entry)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🧭  " + i18n('open.in.browser'),
            click: function(){
                shell.openExternal(entry.link)
            }
        }));

        menu.popup({ window: require('@electron/remote').getCurrentWindow() })
    }

    onMount(() => {
        const el = '#StarEntry' + entryInfo.id;
        tooltipInstance = M.Tooltip.init(document.querySelector(el), {"outDuration": 0, "enterDelay": 20, "inDuration": 30});

    })
    onDestroy(() => {
        if (tooltipInstance !== null) {
            tooltipInstance.destroy()
        }
    });
</script>

<style>
    .omr-entry-item {
        width: 100%;
        max-width: 400px;
        user-select: none;
    }
    .entry-title-line {
        display: flex;
        align-items: center;
        height: 34px;
    }
    .entry-meta-line {
        display: flex;
        align-items: center;
        height: 24px;
        font-size: 0.85rem !important;
    }
    .entry-view-stats, .entry-star-stats {
        display: flex;
        align-items: center;
    }
    .entry-star-stats {
        min-width: 54px;
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
    .entry-title {
        flex-grow: 1;
    }
    .entry-author {
        width: 130px;
        padding-left: 12px;
        flex-grow: 1;
    }
    .entry-date {
        width: 130px;
        padding: 0 8px;
    }
    .podcast-icon {
        width: 13px;
        margin-left: 16px;
    }
    .padding-icon {
        margin-right: 12px;
    }
</style>

{#if entryInfo}
<div class="omr-entry-item tooltipped" id="StarEntry{entryInfo.id}" data-position="right" data-tooltip="{ convHtml(entryInfo.title) }"
     on:contextmenu={()=> showEntryCtxMenu(entryInfo)}>
    <div class="entry-title-line">
        <FeedAvatar feedImage="{entryInfo.image}" feedId="{entryInfo.feed.id}" />

        <span class="truncate entry-title">{ entryInfo.title }</span>

        {#if entryInfo.feed.is_podcast}
            <img src="./icon/podcast.svg" class="podcast-icon" alt="Podcast" />
        {/if}

        <div class="padding-icon"></div>
    </div>

    <div class="entry-meta-line">
        <span class="truncate entry-author">@{readableAuthor(entryInfo.custom.author || entryInfo.author)}</span>
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
