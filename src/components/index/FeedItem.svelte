
<script>
    export let feedInfo = {
        "id": 1233,
        "title": "Thinking About Power Usage and Websites Tips, Tricks, and Techniques on using Cascading Styl",
        "link": "https://css-tricks.com/thinking-about-power-usage-and-websites",
        "comments": "https://css-tricks.com/thinking-about-power-usage-and-websites/#respond",
        "author": "css-tricks.com",
        "image": "https://css-tricks.com/apple-touch-icon.png",
        "description": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
        "rss": "https://css-tricks.com/feed/",
        "is_active": true,
        "is_podcast": false,
        "stats": {
            "update_count": 238,
            "update_ts": 1600785127,
            "unread_count": 6,
            "unread_list": [1,3,56,89,90,34],
        }
    }

</script>

<style>
    .omr-feed-item {
        width: 100%;
        max-width: 400px;
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
        color: #616161;
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
        font-size: 0.95rem;
        margin-right: 3px;
    }
    .feed-toread-stats i {
        font-size: 11px;
        margin-right: 3px;
    }
    .feed-avatar {
        width: 24px;
        height: 24px;
        margin-right: 6px;
        margin-left: 12px;
    }
    .feed-title {
        flex-grow: 1;
        color: #444;
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

<div class="omr-feed-item">
    <div class="feed-title-line">
        <img src="{feedInfo.image}" class="circle feed-avatar" alt="Avatar" />
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
        <span class="truncate feed-date">{feedInfo.stats.update_ts}</span>

        <span class="feed-update-stats">
            <i class="material-icons">sync</i>
            <span class="uv-stats">{ feedInfo.stats.update_count }</span>
        </span>

        <span class="feed-toread-stats">
            <i class="material-icons {feedInfo.stats.unread_count > 0 ? 'primary-color' : ''}">lens</i>
            <span class="uv-stats">{ feedInfo.stats.unread_count }</span>
        </span>
    </div>
</div>