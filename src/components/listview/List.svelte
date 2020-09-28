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
    const { Menu, MenuItem } = remote;

    // TODO add menu icon
    function showFeedCtxMenu() {
        const menu = new Menu();
        menu.append(new MenuItem({
            label: "✏️  Custom",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({
            label: "🗑  Unsubscribe",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({
            label: "🔗  Copy Link",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.popup({ window: remote.getCurrentWindow() })
    }

    function showEntryCtxMenu() {
        const menu = new Menu();
        menu.append(new MenuItem({
            label: "⭐️  Star",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({
            label: "✅️  Mark as read",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({
            label: "🟠  Mark as unread",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({type: "separator",}));

        menu.append(new MenuItem({
            label: "🔗  Copy Link",
            click: function(){
                alert(`you clicked on`);
            }
        }));

        menu.append(new MenuItem({type: "separator",}));
        menu.append(new MenuItem({
            label: "✏️  Custom Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));
        menu.append(new MenuItem({
            label: "🗑  Unsubscribe Feed",
            click: function(){
                alert(`you clicked on`);
            }
        }));

        menu.popup({ window: remote.getCurrentWindow() })
    }

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
    {#if viewMode === 'feed'}
        <li class="collection-item list-li" on:contextmenu={showFeedCtxMenu}>
            <FeedItem />
        </li>
    {:else if viewMode === 'entry'}
        <li class="collection-item list-li" on:contextmenu={showEntryCtxMenu}>
            <EntryItem />
        </li>
    {/if}
    </ul>
</div>

<Pager />
