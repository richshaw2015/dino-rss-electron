<script>
    export let feedInfo = {
        "id": 1233,
        "title": "Thinking About Power Usage",
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
    #omr-feed-nav {
        width: 100%;
        max-width: 400px;
        display: flex;
        align-items: center;
        height: 48px;
        border-bottom: 1px dashed rgba(0,0,0,.14);
    }
    .feed-nav-avatar {
        width: 24px;
        height: 24px;
        margin-left: 18px;
        margin-right: 6px;
    }
    .feed-nav-title {
        flex-grow: 1;
    }
    .back-icon {
        margin-left: 6px;
        margin-right: 6px;
    }
    .check-icon {
        margin-left: 18px;
        margin-right: 6px;
    }
    #omr-feed-back {
        display: flex;
        align-items: center;
        width: 64px;
    }

</style>

<div id="omr-feed-nav">
    <div id="omr-feed-back">
        <i class="material-icons back-icon">arrow_back</i>
        <span class="">Back</span>
    </div>

    <img src="{feedInfo.image}" class="circle feed-nav-avatar" alt="Avatar" />
    <span class="truncate bold feed-nav-title">
        {feedInfo.stats.unread_count > 0 ? feedInfo.title + '(' + feedInfo.stats.unread_count + ')': feedInfo.title}
    </span>
    <i class="material-icons check-icon">check</i>
</div>