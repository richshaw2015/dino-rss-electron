<script>
    import FeedItem from '../index/FeedItem.svelte'
    import FeedNav from '../index/FeedNav.svelte'
    import Pager from '../pager/Pager.svelte'
    import EntryItem from "../index/EntryItem.svelte";

    export let activeTab = 'rss'
    export let viewMode = 'feed'
    export let viewScope = 'all'

    let isFeedEntriesView = false

    const { remote } = require('electron');
    const { BrowserWindow } = remote;
    console.log(BrowserWindow)
</script>

<style>
    .list-wrapper {
        flex-grow: 1;
    }
    .list-ul {
        margin: 8px 0 12px 0;
    }
    .list-li {
        padding: 0;
    }
    .list-li:not(.active):hover{
        background-color:#ddd;
        cursor: pointer;
    }
</style>

{#if isFeedEntriesView}
    <FeedNav />
{/if}

<div class="list-wrapper">
    <ul class="collection list-ul">
        <li class="collection-item list-li">
            {#if viewMode === 'feed'}
                <FeedItem />
            {:else if viewMode === 'entry'}
                <EntryItem />
            {/if}
        </li>
    </ul>
</div>

<Pager />
