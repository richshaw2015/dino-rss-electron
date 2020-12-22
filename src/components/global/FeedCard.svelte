<script>
    export let feedInfo

    import { apiReq } from '../utils/req.js'
    import { shortToast, warnToast, readableCount } from '../utils/helper.js'

    function handleSubscribeFeed() {
        apiReq('/api/feed/subscribe', {feed_id: feedInfo.id}).then( rsp => {
            if (rsp.code === 0) {
                shortToast("Subscribed")
                feedInfo.stats.is_subscribed = true
            } else if (rsp.code === 105) {
                warnToast("Max feeds limit!")
            }
        }).catch(err => {
            warnToast(err + " Subscribe")
        })
    }
</script>

<style>
    .card {
        border-radius: 4px;
    }
    .feed-image {
        max-width: 32.4px;
        max-height: 32.4px;
        width: 32.4px;
        margin-right: 0.3rem;
    }
    .feed-info-line {
        display: flex;
        align-items: center;
        height: 32.4px;
        justify-content: space-between;
    }
    .feed-update-stats {
        width: 54px;
        min-width: 54px;
        margin: 0 8px;
    }
    .feed-update-stats i {
        font-size: 13px;
        margin-right: 3px;
        cursor: auto;
    }
    .feed-update-stats i, .feed-update-stats span {
        vertical-align: middle;
    }
    .card-content {
        padding: 12px;
    }
    .card-title {
        font-size: 18px;
        word-wrap: break-word;
        display: inline;
    }
    .card-content a {
        color: unset;
    }
    .feed-title {
        flex-grow: 1;
    }
    .divider {
        margin: 8px 0;
    }
    .sub-small-btn {
        width: 64px;
        min-width: 64px;
        padding: unset;
        text-align: center;
    }
    .podcast-icon {
        width: 16px;
        margin-right: 4px;
        display: inline;
    }
</style>

{#if feedInfo}
<div class="card">
    <div class="card-content">
        <a href="{ feedInfo.link }" target="_blank">
            {#if feedInfo.is_podcast}
            <img src="./icon/podcast.svg" class="podcast-icon" alt="Podcast" />
            {/if}
            <span class="card-title">{@html feedInfo.description }</span>
        </a>

        <div class="divider"></div>

        <div class="feed-info-line">
            <img src="{ feedInfo.image || 'icon/logo.svg' }" class="feed-image" alt="">

        <span class="truncate feed-title" title="{feedInfo.title}">{ feedInfo.title }</span>
            
            <span class="feed-update-stats">
                <i class="material-icons">sync</i>
                <span class="">{ readableCount(feedInfo.stats.update_count) }</span>
            </span>

            {#if feedInfo.stats.is_subscribed}
                <span class="waves-light sub-small-btn">✔️️</span>
            {:else}
                <span class="waves-effect waves-light btn-small sub-small-btn" on:click={handleSubscribeFeed}>Sub</span>
            {/if}
        </div>
    </div>
</div>
{/if}
