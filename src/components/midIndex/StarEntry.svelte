<script>
    export let entryInfo

    import { starListRsp, starActiveEntry } from '../utils/store.js'
    import { readableAuthor } from '../utils/helper.js'

    const { remote, shell } = require('electron')
    const { Menu, MenuItem } = remote
    import { isWin, shortToast, toast, warnToast, fromNow, isInList, copyToClipboard } from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    import FeedAvatar from '../global/FeedAvatar.svelte'

    function handleStarEntry(entry) {
        if (!entry.stats.has_starred) {
            apiReq('/api/star/entry', {entry_id: entry.id, feed_id: entry.feed.id}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast("Starred")

                    if (isInList(entry, $starListRsp.data)) {
                        $starListRsp.data[entry._index].stats.has_starred = true
                    }
                    if (entry.id === $starActiveEntry.id) {
                        $starActiveEntry.stats.has_starred = true
                    }
                }
            }).catch(err => {
                warnToast(err + " Star")
            })
        }
    }

    function handleUnstarEntry(entry) {
        if (entry.stats.has_starred) {
            apiReq('/api/unstar/entry', {entry_id: entry.id, feed_id: entry.feed.id}).then( rsp => {
                if (rsp.code === 0) {
                    shortToast("Unstar")

                    if (isInList(entry, $starListRsp.data)) {
                        $starListRsp.data[entry._index].stats.has_starred = false
                    }
                    if (entry.id === $starActiveEntry.id) {
                        $starActiveEntry.stats.has_starred = false
                    }
                }
            }).catch(err => {
                warnToast(err + " Star")
            })
        }
    }

    function showEntryCtxMenu(entry) {
        const menu = new Menu();

        menu.append(new MenuItem({
            label: isWin() ? "🌟  Star" : "⭐️  Star",
            visible: !entry.stats.has_starred,
            click: function(){
                handleStarEntry(entry)
            }
        }));
        menu.append(new MenuItem({
            label: "💔  Unstar",
            visible: entry.stats.has_starred,
            click: function(){
                handleUnstarEntry(entry)
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: `🧭  Open in Browser`,
            click: function(){
                shell.openExternal(entry.link)
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
        min-width: 60px;
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
<div class="omr-entry-item" title="{entryInfo.title}" on:contextmenu={()=> showEntryCtxMenu(entryInfo)}>
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
