<script>
    export let listRsp

    import { onMount } from 'svelte'
    import { feedListRspBak, isFeedEntriesView, activeFeed } from '../store/store.js'

    const Mousetrap = require('mousetrap')

    function backToFeedList() {
        isFeedEntriesView.set(false)
        listRsp = $feedListRspBak
    }

    onMount(() => {
        // keyboard shortcut
        Mousetrap.bind('b', function() {
            backToFeedList()
            return false
        });
    })
</script>

<style>
    #omr-feed-nav {
        width: 100%;
        max-width: 400px;
        display: flex;
        align-items: center;
        height: 48px;
        min-height: 48px;
        border-bottom: 1px dashed rgba(0,0,0,.14);
    }
    .feed-nav-avatar {
        min-width: 24px;
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

{#if $isFeedEntriesView}
<div id="omr-feed-nav">
    <div id="omr-feed-back" on:click={backToFeedList}>
        <i class="material-icons back-icon">arrow_back</i>
        <span class="">Back</span>
    </div>

    <img src="{$activeFeed.image}" class="feed-nav-avatar" alt="" />
    <span class="truncate bold feed-nav-title">
        {$activeFeed.stats.unread_count > 0 ? $activeFeed.title + '(' + $activeFeed.stats.unread_count + ')': $activeFeed.title}
    </span>
    <i class="material-icons check-icon">check</i>
</div>
{/if}
