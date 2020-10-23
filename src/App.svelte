<script>
    import { getViewMode, getViewScope, getTokenPromise } from './components/utils/storage.js'
    import { activeTab } from './components/store/store.js'
    import Nav from './components/navbar/Nav.svelte'
    import AppsTab from './components/index/AppsTab.svelte'
    import StarTab from './components/index/StarTab.svelte'
    import RssTab from './components/index/RssTab.svelte'
    import Post from './components/post/Post.svelte'
    import Toolbar from './components/index/Toolbar.svelte'
    import Notice from './components/view/Notice.svelte'

    const tokenPromise = getTokenPromise()
    const M = require('materialize-css')

    let viewMode = getViewMode()
    let viewScope = getViewScope()

    let currentEntry
    let contentApiRsp = {}

    import { onMount } from 'svelte';

    onMount(() => {
        M.AutoInit();
    })
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
        justify-content: space-between;
        background-color: #f3f3f3;
    }
</style>

{#await tokenPromise}
    <!-- TODO loading img -->
    <div class="main-container">
        <div class="left-container">
            <Nav />
        </div>

        <div class="middle-container">
            {#if $activeTab !== 'apps'}
                <Toolbar bind:viewMode bind:viewScope />
                <Notice />
            {:else}
                <AppsTab />
            {/if}
        </div>

        <div class="right-container">
        </div>
    </div>
{:then token}
    <div class="main-container">
        <div class="left-container">
            <Nav />
        </div>

        <div class="middle-container">
            {#if $activeTab === 'rss'}
                <RssTab bind:viewMode bind:viewScope bind:currentEntry bind:contentApiRsp />
            {:else if $activeTab === 'star'}
                <StarTab bind:viewMode bind:currentEntry bind:contentApiRsp />
            {:else if $activeTab === 'apps'}
                <AppsTab />
            {/if}
        </div>

        <div class="right-container">
            <Post {currentEntry} {contentApiRsp} />
        </div>
    </div>
{:catch error}
<div class="main-container">
    <div class="left-container">
        <Nav />
    </div>

    <div class="middle-container">
        {#if $activeTab !== 'apps'}
            <Toolbar bind:viewMode bind:viewScope />
            <Notice msg={error + " Token"} level='warn' />
        {:else}
            <AppsTab />
        {/if}
    </div>

    <div class="right-container">
    </div>
</div>
{/await}
