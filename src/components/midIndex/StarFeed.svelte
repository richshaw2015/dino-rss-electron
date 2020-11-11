<script>
    export let feedInfo

    import { fromNow } from '../utils/helper.js'

    const { remote, shell } = require('electron')
    const { Menu, MenuItem } = remote
    import { shortToast, toast, warnToast, isInList } from '../utils/helper.js'
    import { apiReq } from '../utils/req.js'
    
    function showFeedCtxMenu(feedInfo) {
        const menu = new Menu();

        menu.append(new MenuItem({
            label: `🧭  Open in Browser`,
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
    .feed-star-stats{
        width: 60px;
    }
    .feed-star-stats i {
        font-size: 13px;
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
    .padding-icon {
        margin-right: 12px;
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
        width: 150px;
        padding: 0 10px;
    }

</style>

{#if feedInfo}
<div class="omr-feed-item" title="{feedInfo.title}" on:contextmenu={() => showFeedCtxMenu(feedInfo)}>
    <div class="feed-title-line">
        <img src="{feedInfo.image || 'icon/logo.svg'}" class="feed-avatar" alt="" />
        <span class="truncate feed-title">{ feedInfo.title }</span>

        {#if feedInfo.is_podcast}
            <img src="./icon/podcast.svg" class="podcast-icon" alt="Podcast" />
        {/if}

        {#if feedInfo.is_active === false}
            <i class="material-icons sync-err-icon">sync_disabled</i>
        {/if}

        <div class="padding-icon"></div>
    </div>

    <div class="feed-meta-line">
        <span class="truncate feed-author">@{feedInfo.author}</span>
        <span class="truncate feed-date">{fromNow(feedInfo.stats.update_ts)}</span>

        <span class="feed-star-stats">
            <i class="material-icons">star</i>
            <span class="uv-stats">{ feedInfo.stats.starred_count }</span>
        </span>
    </div>
</div>
{/if}
