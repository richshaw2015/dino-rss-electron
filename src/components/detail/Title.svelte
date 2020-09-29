
<script>
    import { dblClickTitleBar, showNavCtxMenu } from '../utils/helper.js'

    export let entryInfo = {
        "id": 1233,
        "title": "Thinking About Power Usage and Websites",
        "link": "https://css-tricks.com/thinking-about-power-usage-and-websites",
        "comments": "https://css-tricks.com/thinking-about-power-usage-and-websites/#respond",
        "author": "Selena Deckelmann",
        "image": "https://css-tricks.com/apple-touch-icon.png",
        "updated": "3 hours ago",
        "feed": {
            "id": 2,
            "title": "CSS-Tricks",
            "link": "https://css-tricks.com",
            "description": "Tips, Tricks, and Techniques on using Cascading Style Sheets.",
            "rss": "https://css-tricks.com/feed/",
            "is_podcast": true
        },
        "stats": {
            "has_read": true,
            "has_stared": true,
            "uv_stared": 5,
            "uv_view": 246,
        }
    }
</script>

<style>
    #omr-post-title-bar {
        display: flex;
        align-items: center;
        padding-left: 24px;
        padding-right: 10px;
        border-bottom: 1px dashed rgba(0,0,0,0.14);
    }
    #omr-post-title-bar i {
        width: 48px;
        min-width: 48px;
        padding-left: 12px;
        padding-right: 12px;
    }
    .post-title {
        flex-grow: 1;
        font-size: 2rem;
        margin-top: 16px;
        margin-bottom: 16px;
    }
</style>

<div id="omr-post-title-bar" class="drag" on:dblclick={dblClickTitleBar} on:contextmenu={showNavCtxMenu}>
    <div class="post-title">{ entryInfo.title }</div>
    <i class="material-icons {entryInfo.stats.has_stared ? 'primary-color' : ''}">
        {entryInfo.stats.has_stared ? 'star' : 'star_border'}</i>
    <i class="material-icons">format_size</i>
</div>
