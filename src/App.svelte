<script>
    import Nav from './components/navbar/Nav.svelte';
    import Toolbar from './components/index/Toolbar.svelte'
    import List from './components/listview/List.svelte'
    import Apps from './components/index/Apps.svelte'
    import Title from './components/detail/Title.svelte'
    import Third from './components/detail/Third.svelte'
    import Statusbar from './components/detail/Statusbar.svelte'

    import { getViewMode, getViewScope, getFontSize } from './components/utils/storage.js'
    const M = require('materialize-css')

    let activeTab = 'rss'

    let viewMode = getViewMode()
    let viewScope = getViewScope()
    let fontSize = getFontSize()

    let entryInfo = {
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

    import { onMount } from 'svelte';

    onMount(() => {
        M.AutoInit();
    });
</script>

<style>
    .main-container {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        align-items: stretch;
        height: 100vh;
    }
    .left-container {
        width: 70px;
        min-width: 70px;
        max-width: 70px;
        overflow: hidden;
    }
    .middle-container {
        width: 400px;
        min-width: 400px;
        max-width: 400px;
        padding: 0 10px;
        border-right: 1px dashed rgba(0,0,0,.14);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background-color: #ffffff;
    }
    .right-container {
        flex-grow: 1;
        min-width: 500px;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #f3f3f3;
    }
</style>

<div class="main-container">
    <div class="left-container">
        <Nav bind:activeTab />
    </div>

    <div class="middle-container">
        <Toolbar bind:activeTab bind:viewMode bind:viewScope />

        {#if activeTab !== 'apps'}
            <List bind:activeTab bind:viewMode bind:viewScope bind:entryInfo />
        {:else}
            <Apps />
        {/if}
    </div>

    <div class="right-container">
        <Title bind:entryInfo bind:fontSize />
        <Third bind:entryInfo bind:fontSize />
        <Statusbar />
    </div>
</div>
