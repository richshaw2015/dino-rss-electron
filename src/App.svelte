<script>
    import Nav from './components/navbar/Nav.svelte';
    import Toolbar from './components/index/Toolbar.svelte'
    import List from './components/listview/List.svelte'
    import Post from './components/detail/Post.svelte'
    import Apps from './components/index/Apps.svelte'

    import { getViewMode, getViewScope } from './components/utils/toolbar.js'

    let activeTab = 'rss'

    let viewMode = getViewMode()
    let viewScope = getViewScope()

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
    }
    .right-container {
        flex-grow: 1;
        min-width: 500px;
        height: 100%;
    }
</style>

<div class="main-container">
    <div class="left-container">
        <Nav bind:activeTab />
    </div>

    <div class="middle-container">
        <Toolbar bind:activeTab bind:viewMode bind:viewScope />

        {#if activeTab !== 'apps'}
            <List bind:activeTab bind:viewMode bind:viewScope />
        {:else}
            <Apps />
        {/if}
    </div>

    <div class="right-container">
        <Post />
    </div>
</div>
