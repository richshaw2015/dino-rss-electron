
<script>
export let entryInfo = {
    "id": 1233,
    "title": "Thinking About Power Usage and Websites Tips, Tricks, and Techniques on using Cascading Styl",
    "link": "https://css-tricks.com/thinking-about-power-usage-and-websites",
    "comments": "https://css-tricks.com/thinking-about-power-usage-and-websites/#respond",
    "author": "css-tricks.com",
    "image": "https://css-tricks.com/apple-touch-icon.png",
    "updated": "3 Hours ago",
    "feed": {
        "id": 2,
        "title": "CSS-Tricks",
        "link": "https://css-tricks.com",
        "description": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
        "rss": "https://css-tricks.com/feed/",
    },
    "stats": {
        "has_read": true,
        "has_stared": false,
        "uv_stared": 5,
        "uv_view": 246,
    }
}

</script>

<style>
    .omr-entry-item {
        width: 400px;
        border: 0.5px dashed red;
    }
    .entry-title-line {
        display: flex;
        align-items: center;
        height: 30px;
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
        font-size: 0.88rem;
        margin-right: 3px;
    }
    .entry-star-stats i {
        font-size: 0.95rem;
        margin-right: 3px;
    }
    .entry-meta-line {
        display: flex;
        align-items: center;
        height: 24px;
        color: #616161;
        font-size: 0.9rem !important;
    }
    .entry-avatar {
        width: 24px;
        height: 24px;
        margin-right: 6px;
        margin-left: 12px;
    }
    .entry-title {
        flex-grow: 1;
        color: #444;
    }
    .read-icon, .unread-icon {
        width: 18px;
        margin-left: 10px;
        margin-right: 12px;
    }
    .read-icon {
        font-size: 14px;
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

</style>

<div class="omr-entry-item">
    <div class="entry-title-line">
        <img src="{entryInfo.image}" class="circle entry-avatar" alt="Avatar" />
        <span class="truncate entry-title {entryInfo.stats.has_read ? '' : 'bold'}">{ entryInfo.title }</span>
        <i class="material-icons {entryInfo.stats.has_read ? 'read-icon second-color' : 'unread-icon primary-color'}">
            {entryInfo.stats.has_read ? 'check' : 'lens'}</i>
    </div>

    <div class="entry-meta-line">
        <span class="truncate entry-author">@{entryInfo.author}</span>
        <span class="truncate entry-date">{entryInfo.updated}</span>

        <span class="entry-view-stats">
            <i class="material-icons">visibility</i>
            <span class="uv-stats">{ entryInfo.stats.uv_view }</span>
        </span>

        <span class="entry-star-stats">
            <i class="material-icons {entryInfo.stats.has_stared ? 'primary-color' : ''}">star</i>
            <span class="uv-stats">{ entryInfo.stats.uv_stared }</span>
        </span>
    </div>
</div>