<script>
    export let data

    import { apiReq } from '../utils/req.js'
    import { shortToast, warnToast, readableCount, i18n } from '../utils/helper.js'
    import FeedAvatar from '../global/FeedAvatar.svelte'

    function handleSubscribeFeed() {
        apiReq('/api/feed/subscribe', {feed_id: data.feed_id}).then(rsp => {
            if (rsp.code === 0) {
                shortToast(i18n("subscribed"))
                data.is_subscribed = true
            } else if (rsp.code === 105) {
                warnToast(i18n("max.feeds.limit"))
            } else {
                warnToast(i18n("unknown.error"))
            }
        }).catch(err => {
            warnToast(err)
        })
    }
</script>

<style>
    .card {
        border-radius: 4px;
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
        margin: 0 6px;
        display: flex;
        align-items: center;
    }
    .feed-update-stats i {
        font-size: 13px;
        margin-right: 2px;
        cursor: auto;
    }
    .feed-update-stats .count {
        font-size: 14px;
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
        font-size: 1rem;
        font-weight: 550;
    }
    .divider {
        margin: 8px 0;
    }
    .sub-small-btn {
        width: 48px;
        min-width: 48px;
        padding: unset;
        text-align: center;
    }
</style>

{#if data}
<div class="card">
    <div class="card-content">
        <a href="{ data.feed_link }" target="_blank">
            <div>
                <span class="card-title">{@html data.entry_title }</span>
            </div>
        </a>

        <div class="divider"></div>

        <div class="feed-info-line">
            <FeedAvatar feedImage="{data.feed_image}" feedId="{data.feed_id}" marginLeft="{false}" />

            <span class="truncate feed-title" title="{data.feed_title}">{ data.feed_title }</span>
            
            <span class="feed-update-stats">
                <i class="material-icons">sync</i>
                <span class="count">{ readableCount(data.update_count) || 0 }</span>
            </span>

            {#if data.is_subscribed}
                <span class="waves-light sub-small-btn">✔️️</span>
            {:else}
                <span class="waves-effect waves-light btn-small sub-small-btn" on:click={handleSubscribeFeed}>
                    {i18n("add.subscribe")}</span>
            {/if}
        </div>
    </div>
</div>
{/if}
