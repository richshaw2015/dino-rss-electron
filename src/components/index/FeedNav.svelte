<script>
    export let currentFeed
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

    <img src="{currentFeed.image}" class="feed-nav-avatar" alt="Avatar" />
    <span class="truncate bold feed-nav-title">
        {currentFeed.stats.unread_count > 0 ? currentFeed.title + '(' + currentFeed.stats.unread_count + ')': currentFeed.title}
    </span>
    <i class="material-icons check-icon">check</i>
</div>